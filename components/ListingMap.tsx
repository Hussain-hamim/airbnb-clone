import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { listingGeo } from '@/interfaces/listingGeo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
// import MapView from 'react-native-map-clustering';
import * as Location from 'expo-location';

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

  const mapRef = useRef<any>(null);

  // When the component mounts, locate the user
  useEffect(() => {
    onLocateMe();
  }, []);

  const onMarkerSelected = (item: listingGeo) => {
    router.push(`/listing/${item.properties.id}`);
  };

  const onLocateMe = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 7,
      longitudeDelta: 7,
    };

    mapRef.current?.animateToRegion(region);
  };

  const renderCluster = (cluster: any) => {
    const { id, geometry, onPress, properties } = cluster;

    const points = properties.point_count;
    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}
      >
        <View style={styles.marker}>
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              fontFamily: 'mon-sb',
            }}
          >
            {points}
          </Text>
        </View>
      </Marker>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={[{ width: width, height: height }]}
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
          >
            {/* <View style={styles.marker}>
              <Text style={styles.markerText}>€ {item.properties.price}</Text>
            </View> */}
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.locateBtn} onPress={onLocateMe}>
        <Ionicons name='navigate' size={24} color={Colors.dark} />
      </TouchableOpacity>
    </View>
  );
};

export default ListingMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
  },
  locateBtn: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});
