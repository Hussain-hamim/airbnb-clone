import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { listingGeo } from '@/interfaces/listingGeo';
import { useRouter } from 'expo-router';

interface Props {
  listings: any;
}

// Khost, Afghanistan
const INITIAL_REGION = {
  latitude: 33.3333,
  longitude: 69.9167,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const ListingMap = ({ listings }: Props) => {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const onMarkerSelected = (item: listingGeo) => {
    router.push(`/listing/${item.properties.id}`);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={[{ width: width, height: height }, styles.map]}
        showsUserLocation
        showsMyLocationButton
        initialRegion={INITIAL_REGION}
      >
        {listings.features.map((item: listingGeo) => (
          <Marker
            onPress={() => onMarkerSelected(item)}
            key={item.properties.id}
            coordinate={{
              latitude: +item.properties.latitude,
              longitude: +item.properties.longitude,
            }}
          />
        ))}
      </MapView>
    </View>
  );
};

export default ListingMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {},
});
