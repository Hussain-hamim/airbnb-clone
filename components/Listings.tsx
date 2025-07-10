import {
  View,
  Text,
  StyleSheet,
  ListRenderItem,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';
import { Listing } from '@/interfaces/listing';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = 340;

interface Props {
  listings: any[];
  category: string;
}
const Listings = ({ listings: items, category }: Props) => {
  const listRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const filteredItems = items.filter((item) => item.medium_url);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  const toggleFavorite = (id: string) => {
    setIsFavorite((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'TV':
      case 'Cable TV':
        return <Ionicons name='tv-outline' size={16} color={Colors.dark} />;
      case 'Wireless Internet':
        return <Ionicons name='wifi-outline' size={16} color={Colors.dark} />;
      case 'Kitchen':
        return (
          <Ionicons name='restaurant-outline' size={16} color={Colors.dark} />
        );
      case 'Free parking on premises':
        return <Ionicons name='car-outline' size={16} color={Colors.dark} />;
      case 'Breakfast':
        return <Ionicons name='cafe-outline' size={16} color={Colors.dark} />;
      case 'Washer':
        return (
          <MaterialIcons
            name='local-laundry-service'
            size={16}
            color={Colors.dark}
          />
        );
      case 'Dryer':
        return <MaterialIcons name='dry' size={16} color={Colors.dark} />;
      default:
        return (
          <Ionicons
            name='checkmark-circle-outline'
            size={16}
            color={Colors.dark}
          />
        );
    }
  };

  const renderRow: ListRenderItem<Listing> = ({ item }) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity activeOpacity={0.9}>
        <Animated.View
          style={styles.listing}
          entering={FadeInRight.delay((100 * item.id) % 10)}
          exiting={FadeOutLeft}
        >
          {/* Image with overlay */}
          <ImageBackground
            source={{
              uri:
                item.medium_url ||
                `https://source.unsplash.com/random/300x300?sig=${item.id}`,
            }}
            style={styles.image}
            imageStyle={styles.imageStyle}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              locations={[0.6, 1]}
              style={styles.gradient}
            />

            {/* Superhost badge */}
            {item.features?.includes('Host Is Superhost') && (
              <View style={styles.superhostBadge}>
                <FontAwesome name='superpowers' size={12} color='#FF5A5F' />
                <Text style={styles.superhostText}>SUPERHOST</Text>
              </View>
            )}

            {/* Favorite button */}
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Ionicons
                name={isFavorite[item.id] ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite[item.id] ? '#FF385C' : '#fff'}
              />
            </TouchableOpacity>

            {/* Price tag */}
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>€{item.price}</Text>
              <Text style={styles.nightText}>/night</Text>
            </View>
          </ImageBackground>

          {/* Listing details */}
          <View style={styles.detailsContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name='star' size={16} color='#FFD700' />
                <Text style={styles.ratingText}>
                  {(item.review_scores_rating / 20).toFixed(1)}
                </Text>
              </View>
            </View>

            <Text style={styles.location} numberOfLines={1}>
              {item.neighbourhood || 'Unknown location'}
            </Text>

            <View style={styles.amenitiesContainer}>
              {item.amenities?.slice(0, 3).map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  {renderAmenityIcon(amenity)}
                  <Text style={styles.amenityText} numberOfLines={1}>
                    {amenity.replace(
                      'translation missing: en.hosting_amenity_50',
                      'Workspace'
                    )}
                  </Text>
                </View>
              ))}
              {item.amenities?.length > 3 && (
                <Text style={styles.moreAmenities}>
                  +{item.amenities.length - 3} more
                </Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.hostInfo}>
              {item.host_picture_url && (
                <Image
                  source={{ uri: item.host_picture_url }}
                  style={styles.hostImage}
                />
              )}
              <View style={styles.hostDetails}>
                <Text style={styles.hostText}>Hosted by {item.host_name}</Text>
                <Text style={styles.hostSince}>
                  Joined in {new Date(item.host_since).getFullYear()}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={[defaultStyles.container, styles.container]}>
      <Animated.FlatList
        renderItem={renderRow}
        data={loading ? [] : filteredItems}
        ref={listRef}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.resultsText}>
              {filteredItems.length} stays in {category}
            </Text>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => router.push('/map/map')}
            >
              <Ionicons name='map-outline' size={18} color={Colors.dark} />
              <Text style={styles.mapButtonText}>Map</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 80,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  mapButtonText: {
    marginLeft: 6,
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.dark,
  },
  listing: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: CARD_WIDTH,
  },
  image: {
    width: '100%',
    height: CARD_HEIGHT * 0.6,
  },
  imageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  superhostBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  superhostText: {
    fontSize: 10,
    fontFamily: 'mon-sb',
    color: Colors.dark,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'mon-sb',
    color: Colors.dark,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    marginLeft: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: 'mon',
    color: Colors.grey,
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 12,
    fontFamily: 'mon',
    color: Colors.dark,
    marginLeft: 4,
    maxWidth: 100,
  },
  moreAmenities: {
    fontSize: 12,
    fontFamily: 'mon',
    color: Colors.grey,
    alignSelf: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightGrey,
    marginVertical: 12,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  hostDetails: {
    flex: 1,
  },
  hostText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: Colors.dark,
  },
  hostSince: {
    fontSize: 12,
    fontFamily: 'mon',
    color: Colors.grey,
  },
  heartButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  priceTag: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priceText: {
    fontSize: 20,
    fontFamily: 'mon-sb',
    color: '#fff',
  },
  nightText: {
    fontSize: 14,
    fontFamily: 'mon',
    color: '#fff',
    marginLeft: 2,
    marginBottom: 2,
  },
  separator: {
    height: 16,
  },
  resultsText: {
    fontSize: 16,
    fontFamily: 'mon-sb',
    color: Colors.dark,
  },
});

export default Listings;
