import { StyleSheet, Text, View } from 'react-native';

import { Link, Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import { useMemo, useState } from 'react';
import Listings from '@/components/Listings';
import listingData from '@/assets/data/airbnb-listings.json';

export default function TabOneScreen() {
  const [category, setCategory] = useState<string | null>(null);
  const items = useMemo(() => listingData as any, []);

  console.log('index count', items.length);

  const onDataChanged = (data: string) => {
    console.log('Data changed:', data);
    setCategory(data);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />

      <Listings listings={items} category={category} />
    </View>
  );
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
