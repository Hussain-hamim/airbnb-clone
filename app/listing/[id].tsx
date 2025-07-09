import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Share,
  ScrollView,
  Platform,
} from 'react-native';
import listingsData from '@/assets/data/airbnb-listings.json';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
} from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, {
  SlideInDown,
  FadeIn,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = Platform.OS === 'ios' ? 350 : 350;
const HEADER_HEIGHT = 100;

const DetailsPage = () => {
  const { id } = useLocalSearchParams();
  const listing = (listingsData as any[]).find((item) => item.id === id);
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [isFavorite, setIsFavorite] = useState(false);

  const shareListing = async () => {
    try {
      await Share.share({
        title: listing.name,
        url: listing.listing_url,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerBackground: () => (
        <Animated.View
          style={[headerAnimatedStyle, styles.header]}
        ></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Feather name='share-2' size={20} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? '#FF385C' : '#000'}
            />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name='chevron-back' size={24} color={'#000'} />
        </TouchableOpacity>
      ),
    });
  }, [isFavorite]);

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT * 0.3, 0, IMG_HEIGHT * 0.5]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [1.5, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 2], [0, 1]),
      backgroundColor: interpolate(
        scrollOffset.value,
        [0, IMG_HEIGHT / 2],
        ['transparent', '#ffffff']
      ),
    };
  });

  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'TV':
      case 'Cable TV':
        return <Ionicons name='tv-outline' size={20} color={Colors.dark} />;
      case 'Wireless Internet':
        return <Ionicons name='wifi-outline' size={20} color={Colors.dark} />;
      case 'Kitchen':
        return (
          <Ionicons name='restaurant-outline' size={20} color={Colors.dark} />
        );
      case 'Free parking on premises':
        return <Ionicons name='car-outline' size={20} color={Colors.dark} />;
      case 'Breakfast':
        return <Ionicons name='cafe-outline' size={20} color={Colors.dark} />;
      case 'Washer':
        return (
          <MaterialIcons
            name='local-laundry-service'
            size={20}
            color={Colors.dark}
          />
        );
      case 'Dryer':
        return <MaterialIcons name='dry' size={20} color={Colors.dark} />;
      case 'Family/kid friendly':
        return <Ionicons name='people-outline' size={20} color={Colors.dark} />;
      default:
        return (
          <Ionicons
            name='checkmark-circle-outline'
            size={20}
            color={Colors.dark}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: listing.xl_picture_url }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode='cover'
        ></Animated.Image>

        <View style={styles.infoContainer}>
          {/* Title and Rating */}
          <View style={styles.titleRow}>
            <Text style={styles.name}>{listing.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name='star' size={18} color='#FFD700' />
              <Text style={styles.ratings}>
                {(listing.review_scores_rating / 20).toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Location and Room Type */}
          <Text style={styles.location}>
            <Ionicons
              name='location-outline'
              size={16}
              color={Colors.primary}
            />{' '}
            {listing.smart_location}
          </Text>
          <Text style={styles.roomType}>{listing.room_type}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Host Info */}
          <View style={styles.hostView}>
            <Image
              source={{ uri: listing.host_picture_url }}
              style={styles.hostImage}
            />
            <View style={styles.hostDetails}>
              <Text style={styles.hostName}>Hosted by {listing.host_name}</Text>
              <Text style={styles.hostSince}>
                Joined in {new Date(listing.host_since).getFullYear()}
              </Text>
              {listing.features?.includes('Host Is Superhost') && (
                <View style={styles.superhostBadge}>
                  <FontAwesome name='superpowers' size={12} color='#FF5A5F' />
                  <Text style={styles.superhostText}>SUPERHOST</Text>
                </View>
              )}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Room Details */}
          <View
            style={[styles.detailsSection, { justifyContent: 'space-between' }]}
          >
            <View>
              <View style={styles.detailItem}>
                <Ionicons name='people-outline' size={24} color={Colors.dark} />
                <View style={styles.detailText}>
                  <Text style={styles.detailTitle}>Guests</Text>
                  <Text style={styles.detailValue}>
                    {listing.guests_included} guests
                  </Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name='bed-outline' size={24} color={Colors.dark} />
                <View style={styles.detailText}>
                  <Text style={styles.detailTitle}>Bedrooms</Text>
                  <Text style={styles.detailValue}>
                    {listing.bedrooms} bedroom
                    {listing.bedrooms !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={styles.detailItem}>
                <Ionicons name='bed-outline' size={24} color={Colors.dark} />
                <View style={styles.detailText}>
                  <Text style={styles.detailTitle}>Beds</Text>
                  <Text style={styles.detailValue}>
                    {listing.beds} bed{listing.beds !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name='bathtub' size={24} color={Colors.dark} />
                <View style={styles.detailText}>
                  <Text style={styles.detailTitle}>Bathrooms</Text>
                  <Text style={styles.detailValue}>
                    {listing.bathrooms} bathroom
                    {listing.bathrooms !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Amenities */}
          <Text style={styles.sectionTitle}>What this place offers</Text>
          <View style={styles.amenitiesGrid}>
            {listing.amenities
              ?.slice(0, 6)
              .map((amenity: string, index: number) => (
                <View key={index} style={styles.amenityItem}>
                  {renderAmenityIcon(amenity)}
                  <Text style={styles.amenityText}>
                    {amenity.replace(
                      'translation missing: en.hosting_amenity_50',
                      'Workspace'
                    )}
                  </Text>
                </View>
              ))}
          </View>
          {listing.amenities?.length > 6 && (
            <TouchableOpacity style={styles.showAllButton}>
              <Text style={styles.showAllText}>
                Show all {listing.amenities.length} amenities
              </Text>
              <Ionicons name='chevron-forward' size={16} color={Colors.dark} />
            </TouchableOpacity>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>About this place</Text>
          <Text style={styles.description}>{listing.description}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Reviews */}
          <Text style={styles.sectionTitle}>
            {listing.number_of_reviews} reviews
          </Text>
          <View style={styles.reviewSummary}>
            <View style={styles.reviewCategory}>
              <Text style={styles.reviewLabel}>Cleanliness</Text>
              <View style={styles.reviewBar}>
                <View
                  style={[
                    styles.reviewProgress,
                    { width: `${listing.review_scores_cleanliness * 10}%` },
                  ]}
                />
              </View>
              <Text style={styles.reviewScore}>
                {listing.review_scores_cleanliness}
              </Text>
            </View>
            <View style={styles.reviewCategory}>
              <Text style={styles.reviewLabel}>Accuracy</Text>
              <View style={styles.reviewBar}>
                <View
                  style={[
                    styles.reviewProgress,
                    { width: `${listing.review_scores_accuracy * 10}%` },
                  ]}
                />
              </View>
              <Text style={styles.reviewScore}>
                {listing.review_scores_accuracy}
              </Text>
            </View>
            <View style={styles.reviewCategory}>
              <Text style={styles.reviewLabel}>Location</Text>
              <View style={styles.reviewBar}>
                <View
                  style={[
                    styles.reviewProgress,
                    { width: `${listing.review_scores_location * 10}%` },
                  ]}
                />
              </View>
              <Text style={styles.reviewScore}>
                {listing.review_scores_location}
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Footer with Reserve Button */}
      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.priceText}>€{listing.price}</Text>
            <Text style={styles.nightText}>night</Text>
          </View>
          <TouchableOpacity style={[defaultStyles.btn, styles.reserveButton]}>
            <Text style={defaultStyles.btnText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
    justifyContent: 'flex-end',
  },
  gradient: {
    height: '30%',
    width: '100%',
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
    flex: 1,
    marginRight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
    marginLeft: 4,
  },
  location: {
    fontSize: 16,
    fontFamily: 'mon-sb',
    marginTop: 4,
    color: Colors.dark,
  },
  roomType: {
    fontSize: 16,
    fontFamily: 'mon',
    color: Colors.grey,
    marginBottom: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 24,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hostImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontFamily: 'mon-sb',
    marginBottom: 4,
  },
  hostSince: {
    fontSize: 14,
    fontFamily: 'mon',
    color: Colors.grey,
    marginBottom: 8,
  },
  superhostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,90,95,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  superhostText: {
    fontSize: 12,
    fontFamily: 'mon-sb',
    color: Colors.primary,
    marginLeft: 4,
  },
  detailsSection: {
    marginBottom: 24,
    flex: 1,
    flexDirection: 'row',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    marginLeft: 16,
  },
  detailTitle: {
    fontSize: 14,
    fontFamily: 'mon',
    color: Colors.grey,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'mon-sb',
    color: Colors.dark,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'mon-sb',
    marginBottom: 16,
    color: Colors.dark,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amenityItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'mon',
    color: Colors.dark,
    marginLeft: 12,
  },
  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  showAllText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: Colors.dark,
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: 16,
    fontFamily: 'mon',
    lineHeight: 24,
    color: Colors.dark,
  },
  reviewSummary: {
    marginTop: 16,
  },
  reviewCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewLabel: {
    width: 100,
    fontSize: 14,
    fontFamily: 'mon',
    color: Colors.grey,
  },
  reviewBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.grey,
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  reviewProgress: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  reviewScore: {
    width: 24,
    fontSize: 14,
    fontFamily: 'mon-sb',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 22,
    fontFamily: 'mon-sb',
    color: Colors.dark,
  },
  nightText: {
    fontSize: 16,
    fontFamily: 'mon',
    color: Colors.grey,
  },
  reserveButton: {
    paddingHorizontal: 32,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#fff',
    height: HEADER_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
});

export default DetailsPage;
