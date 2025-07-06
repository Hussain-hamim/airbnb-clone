import { StyleSheet, Text, View } from 'react-native';

import { Link, Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import { useState } from 'react';
import Listings from '@/components/Listings';

export default function TabOneScreen() {
  const [category, setCategory] = useState<string | null>(null);

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

      <Listings listings={[]} category={category} />
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
