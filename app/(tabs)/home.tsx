import CustomMapView from '@/components/MapView';
import PlaceDetails from '@/components/PlacesDetails';
import SearchBar from '@/components/SearchBar';
import SearchHistory from '@/components/SearchHistory';
import SearchResults from '@/components/SearchResult';
import { AutocompletePrediction, Place } from '@/types/types';
import { GooglePlacesAPI } from '@/utils/GooglePlacesAPI';
import { debounce } from '@/utils/hepler';
import { StorageService } from '@/utils/StorageService';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

const HomePage = () => {
  const [searchResults, setSearchResults] = useState<AutocompletePrediction[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchHistory, setSearchHistory] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await StorageService.getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveToHistory = async (place: Place) => {
    try {
      await StorageService.saveSearchHistory(place);
      loadSearchHistory(); // Refresh history
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await GooglePlacesAPI.searchPlaces(query);
        setSearchResults(results);
      } catch (error) {
        Alert.alert('Error', 'Failed to search places');
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handleSearch = (query: string) => {
    debouncedSearch(query);
    setShowHistory(false);
  };

  const handlePlaceSelect = async (place: AutocompletePrediction) => {
    try {
      const placeDetails = await GooglePlacesAPI.getPlaceDetails(place.place_id);
      setSelectedPlace(placeDetails);
      setSearchResults([]);
      setShowHistory(false);
      await saveToHistory(placeDetails);
    } catch (error) {
      Alert.alert('Error', 'Failed to get place details');
      console.error('Place details error:', error);
    }
  };

  const handleHistorySelect = (place: Place) => {
    setSelectedPlace(place);
    setShowHistory(false);
    setSearchResults([]);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        onSearch={handleSearch}
        onFocus={() => setShowHistory(true)}
        isSearching={isSearching}
        onHistoryToggle={toggleHistory}
      />
      
      {showHistory ? (
        <SearchHistory
          history={searchHistory}
          onSelectPlace={handleHistorySelect}
        />
      ) : (
        <>
          {searchResults.length > 0 && (
            <SearchResults
              results={searchResults}
              onSelectPlace={handlePlaceSelect}
            />
          )}
          <CustomMapView selectedPlace={selectedPlace} />
          {selectedPlace && <PlaceDetails place={selectedPlace} />}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomePage;