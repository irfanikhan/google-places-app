import { AutocompletePrediction } from '@/types/types';
import Icon from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type SearchResultsProps = {
    results: AutocompletePrediction[];
    onSelectPlace: (place: AutocompletePrediction) => void;
};

const SearchResults = ({ results, onSelectPlace }: SearchResultsProps) => {
  const renderResultItem = ({ item }: { item: AutocompletePrediction }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => onSelectPlace(item)}
    >
      <Icon name="place" size={24} color="#007AFF" style={styles.placeIcon} />
      <View style={styles.resultContent}>
        <Text style={styles.mainText} numberOfLines={1}>
          {item.structured_formatting?.main_text || item.description}
        </Text>
        <Text style={styles.secondaryText} numberOfLines={1}>
          {item.structured_formatting?.secondary_text || ''}
        </Text>
      </View>
      <Icon name="north-west" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  if (results.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderResultItem}
        keyExtractor={(item) => item.place_id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    maxHeight: 300,
  },
  list: {
    flex: 1,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  placeIcon: {
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  mainText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default SearchResults;