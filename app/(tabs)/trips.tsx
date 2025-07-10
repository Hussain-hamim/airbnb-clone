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
import trips from '@/assets/data/trips.json';
import { Listing } from '@/interfaces/listing';

export default function Trips() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trips</Text>
      </View>

      <FlatList
        data={trips}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trip}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.dates}>{item.dates}</Text>
              <View style={styles.status}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        item.status === 'Upcoming'
                          ? Colors.primary
                          : Colors.grey,
                    },
                  ]}
                />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
  },
  trip: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: 'mon-sb',
    marginBottom: 8,
  },
  dates: {
    color: Colors.grey,
    fontFamily: 'mon',
    marginBottom: 8,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'mon-sb',
  },
});
