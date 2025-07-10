import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { places } from '@/assets/data/places';
import { useRouter } from 'expo-router';
// @ts-ignore
import DatePicker from 'react-native-modern-datepicker';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const guestsGroups = [
  {
    name: 'Adults',
    text: 'Ages 13 or above',
    count: 0,
  },
  {
    name: 'Children',
    text: 'Ages 2-12',
    count: 0,
  },
  {
    name: 'Infants',
    text: 'Under 2',
    count: 0,
  },
  {
    name: 'Pets',
    text: 'Pets allowed',
    count: 0,
  },
];

const Page = () => {
  const [openCard, setOpenCard] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [groups, setGroups] = useState(guestsGroups);
  const [selectedDate, setSelectedDate] = useState('');
  const router = useRouter();
  const today = new Date().toISOString().substring(0, 10);

  const onClearAll = () => {
    setSelectedPlace(0);
    setOpenCard(0);
    setGroups(guestsGroups.map((group) => ({ ...group, count: 0 })));
    setSelectedDate('');
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BlurView
        intensity={Platform.OS === 'android' ? 100 : 70}
        style={styles.container}
        tint='light'
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Where */}
          <View style={styles.card}>
            {openCard != 0 && (
              <AnimatedTouchableOpacity
                onPress={() => setOpenCard(0)}
                style={styles.cardPreview}
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
              >
                <View>
                  <Text style={styles.previewText}>Where</Text>
                  <Text style={styles.previewdData}>I'm flexible</Text>
                </View>
                <Ionicons name='chevron-down' size={20} color={Colors.grey} />
              </AnimatedTouchableOpacity>
            )}

            {openCard == 0 && (
              <>
                <Text style={styles.cardHeader}>Where to?</Text>
                <Animated.View
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={styles.cardBody}
                >
                  <View style={styles.searchSection}>
                    <Ionicons
                      style={styles.searchIcon}
                      name='search'
                      size={20}
                      color={Colors.grey}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder='Search destinations'
                      placeholderTextColor={Colors.grey}
                    />
                  </View>

                  <Text style={styles.sectionTitle}>Top destinations</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.placesContainer}
                  >
                    {places.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => setSelectedPlace(index)}
                        key={index}
                        style={styles.placeContainer}
                      >
                        <Image
                          source={item.img}
                          style={
                            selectedPlace == index
                              ? styles.placeSelected
                              : styles.place
                          }
                        />
                        <Text style={styles.placeTitle}>{item.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              </>
            )}
          </View>

          {/* When */}
          <View style={styles.card}>
            {openCard != 1 && (
              <AnimatedTouchableOpacity
                onPress={() => setOpenCard(1)}
                style={styles.cardPreview}
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
              >
                <View>
                  <Text style={styles.previewText}>When</Text>
                  <Text style={styles.previewdData}>
                    {selectedDate ? selectedDate : 'Any week'}
                  </Text>
                </View>
                <Ionicons name='chevron-down' size={20} color={Colors.grey} />
              </AnimatedTouchableOpacity>
            )}

            {openCard == 1 && (
              <>
                <Text style={styles.cardHeader}>When's your trip?</Text>
                <Animated.View style={styles.cardBody}>
                  <DatePicker
                    options={{
                      defaultFont: 'mon',
                      headerFont: 'mon-sb',
                      mainColor: Colors.primary,
                      borderColor: 'transparent',
                    }}
                    current={today}
                    selected={selectedDate || today}
                    mode={'calendar'}
                    onSelectedChange={handleDateChange}
                  />
                </Animated.View>
              </>
            )}
          </View>

          {/* Guests */}
          <View style={styles.card}>
            {openCard != 2 && (
              <AnimatedTouchableOpacity
                onPress={() => setOpenCard(2)}
                style={styles.cardPreview}
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
              >
                <View>
                  <Text style={styles.previewText}>Who</Text>
                  <Text style={styles.previewdData}>
                    {groups.reduce((total, group) => total + group.count, 0) > 0
                      ? `${groups.reduce(
                          (total, group) => total + group.count,
                          0
                        )} guests`
                      : 'Add guests'}
                  </Text>
                </View>
                <Ionicons name='chevron-down' size={20} color={Colors.grey} />
              </AnimatedTouchableOpacity>
            )}

            {openCard == 2 && (
              <>
                <Text style={styles.cardHeader}>Who's coming?</Text>
                <Animated.View style={styles.cardBody}>
                  {groups.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.guestItem,
                        index + 1 < guestsGroups.length
                          ? styles.itemBorder
                          : null,
                      ]}
                    >
                      <View>
                        <Text style={styles.guestName}>{item.name}</Text>
                        <Text style={styles.guestDescription}>{item.text}</Text>
                      </View>

                      <View style={styles.counterContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            const newGroups = [...groups];
                            newGroups[index].count =
                              newGroups[index].count > 0
                                ? newGroups[index].count - 1
                                : 0;
                            setGroups(newGroups);
                          }}
                        >
                          <Ionicons
                            name='remove-circle-outline'
                            size={26}
                            color={
                              groups[index].count > 0 ? Colors.grey : '#cdcdcd'
                            }
                          />
                        </TouchableOpacity>
                        <Text style={styles.counterText}>{item.count}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            const newGroups = [...groups];
                            newGroups[index].count++;
                            setGroups(newGroups);
                          }}
                        >
                          <Ionicons
                            name='add-circle-outline'
                            size={26}
                            color={Colors.grey}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </Animated.View>
              </>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
          <View style={styles.footerContent}>
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={onClearAll}
            >
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name='search-outline'
                size={20}
                color={'#fff'}
                style={styles.searchButtonIcon}
              />
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </BlurView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor:
      Platform.OS === 'android'
        ? 'rgba(255,255,255,0.8)'
        : 'rgba(255,255,255,0.5)',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    gap: 20,
  },
  cardHeader: {
    fontFamily: 'mon-b',
    fontSize: 24,
    padding: 20,
    color: Colors.dark,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  searchSection: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    marginBottom: 16,
  },
  searchIcon: {
    padding: 10,
    marginRight: 5,
  },
  inputField: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    fontFamily: 'mon',
    color: Colors.dark,
  },
  sectionTitle: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: Colors.dark,
    marginBottom: 16,
  },
  placesContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  placeContainer: {
    width: 120,
    alignItems: 'center',
  },
  place: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  placeSelected: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  placeTitle: {
    fontFamily: 'mon',
    paddingTop: 8,
    color: Colors.dark,
    textAlign: 'center',
  },
  previewText: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.grey,
  },
  previewdData: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.dark,
  },
  guestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  guestName: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: Colors.dark,
  },
  guestDescription: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey,
  },
  counterContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontFamily: 'mon',
    fontSize: 16,
    minWidth: 18,
    textAlign: 'center',
    color: Colors.dark,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.grey,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  clearAllButton: {
    justifyContent: 'center',
  },
  clearAllText: {
    fontSize: 16,
    fontFamily: 'mon-sb',
    textDecorationLine: 'underline',
    color: Colors.dark,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 2,
    gap: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontFamily: 'mon-sb',
    fontSize: 16,
  },
  searchButtonIcon: {
    marginRight: 4,
  },
});

export default Page;
