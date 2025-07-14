import { Place } from '@/types/types';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');


type CustomMapViewProps = {  selectedPlace: Place | null;
};

const CustomMapView = ({ selectedPlace }: CustomMapViewProps) => {
  const defaultRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getRegion = () => {
    if (selectedPlace && selectedPlace.geometry) {
      const { lat, lng } = selectedPlace.geometry.location;
      return {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return defaultRegion;
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={getRegion()}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
      >
        {selectedPlace && selectedPlace.geometry && (
          <Marker
            coordinate={{
              latitude: selectedPlace.geometry.location.lat,
              longitude: selectedPlace.geometry.location.lng,
            }}
            title={selectedPlace.name}
            description={selectedPlace.formatted_address}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height * 0.6,
  },
});

export default CustomMapView;