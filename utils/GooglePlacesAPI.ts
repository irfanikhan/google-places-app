
import Constants from 'expo-constants';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const GOOGLE_PLACES_API_KEY = Constants?.expoConfig?.extra?.googlePlacesApiKey;

export class GooglePlacesAPI {
  static async searchPlaces(query: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      console.log('Search Places Response:', JSON.stringify(data.predictions, null, 2));
      if (data.status === 'OK') {
        return data.predictions;
      } else {
        throw new Error(data.error_message || 'Failed to search places');
      }
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  static async getPlaceDetails(placeId: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,formatted_phone_number,website,opening_hours,types&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.result;
      } else {
        throw new Error(data.error_message || 'Failed to get place details');
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  }
}