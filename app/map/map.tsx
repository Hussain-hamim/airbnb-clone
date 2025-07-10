import { StyleSheet, Text, View } from 'react-native';
import listingDataGeo from '@/assets/data/airbnb-listings.geo.json';
import ListingMap from '@/components/ListingMap';
import { useMemo, useState } from 'react';

export default function Map() {
  const [category, setCategory] = useState<string>('Tiny homes');
  const items = useMemo(() => listingDataGeo as any, []);

  const onDataChanged = (data: string) => {
    setCategory(data);
  };

  return <ListingMap listings={items} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
