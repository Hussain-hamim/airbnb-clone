import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import listings from '@/assets/data/fav-listings.json';
import { Link } from 'expo-router';

export default function Wishlists() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlists</Text>
      </View>

      <FlatList
        data={listings}
        renderItem={({ item }) => (
          <Link href={`/listing/${item.id}`} style={styles.listing}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.rating}>
                <Ionicons name='star' size={16} color={Colors.primary} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.price}>${item.price} night</Text>
            </View>
          </Link>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
  },
  listing: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontFamily: 'mon-sb',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontFamily: 'mon-sb',
  },
  location: {
    color: Colors.grey,
    fontFamily: 'mon',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'mon-sb',
  },
});
