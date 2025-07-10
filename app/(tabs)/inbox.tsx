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
import messages from '@/assets/data/messages.json';

export default function Inbox() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.message}>
            <Image source={{ uri: item.hostImage }} style={styles.avatar} />
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.hostName}>{item.hostName}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.text} numberOfLines={1}>
                {item.text}
              </Text>
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
  message: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  hostName: {
    fontFamily: 'mon-sb',
    fontSize: 16,
  },
  time: {
    color: Colors.grey,
    fontFamily: 'mon',
  },
  text: {
    color: Colors.grey,
    fontFamily: 'mon',
  },
});
