import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';

type ListingsProps = {
  listings?: any[];
  category?: string | null;
};

const Listings = ({ listings, category }: ListingsProps) => {
  useEffect(() => {
    console.log('Listings component mounted or updated');
  }, [listings, category]);

  return (
    <View>
      <Text>Listings {category}</Text>
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({});
