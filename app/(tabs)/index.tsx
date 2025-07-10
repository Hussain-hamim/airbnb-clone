import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import { useMemo, useState } from 'react';
import listingData from '@/assets/data/airbnb-listings.json';
import listingDataGeo from '@/assets/data/airbnb-listings.geo.json';
import ListingMap from '@/components/ListingMap';
import ListingBottomSheet from '@/components/ListingBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Listings from '@/components/Listings';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function TabOneScreen() {
  const [category, setCategory] = useState<string>('Tiny homes');
  const items = useMemo(() => listingData as any, []);
  const router = useRouter();

  const onDataChanged = (data: string) => {
    setCategory(data);
  };

  const onShowMap = () => {
    router.push('/map/map');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
          }}
        />

        <Listings listings={items} category={category} />

        <View style={styles.absoluteView}>
          <TouchableOpacity onPress={onShowMap} style={styles.btn}>
            <Text style={{ fontFamily: 'mon-sb', color: '#fff' }}>Map</Text>
            <Ionicons
              name='map'
              size={20}
              style={{ marginLeft: 10 }}
              color={'#fff'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },

  absoluteView: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.dark,
    padding: 14,
    height: 50,
    borderRadius: 30,
    flexDirection: 'row',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});
