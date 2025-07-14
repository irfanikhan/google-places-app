import Icon from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type SearchBarProps = {
    onSearch: (query: string) => void;
    onFocus: () => void;
    isSearching: boolean;
    onHistoryToggle: () => void;
};

const SearchBar = ({ onSearch, onFocus, isSearching, onHistoryToggle }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleChangeText = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search for places..."
          value={query}
          onChangeText={handleChangeText}
          onFocus={onFocus}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isSearching && (
          <ActivityIndicator size="small" color="#007AFF" style={styles.loading} />
        )}
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Icon name="clear" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={onHistoryToggle} style={styles.historyButton}>
        <Icon name="history" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  loading: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
  historyButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;