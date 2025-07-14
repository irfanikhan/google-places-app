import { Place } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 50;

export class StorageService {
  static async getSearchHistory() {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error retrieving search history:', error);
      return [];
    }
  }

  static async saveSearchHistory(place: Place) {
    try {
      const history = await this.getSearchHistory();
      
      // Remove if already exists to avoid duplicates
      const filteredHistory = history.filter(
        (item: Place) => item.place_id !== place.place_id
      );
      
      // Add to beginning of array
      const updatedHistory = [place, ...filteredHistory];
      
      // Limit the number of items
      const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
      throw error;
    }
  }

  static async clearSearchHistory() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
      throw error;
    }
  }
}