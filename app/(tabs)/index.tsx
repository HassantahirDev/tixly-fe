import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEventCategories,
  fetchFeaturedEvents,
  fetchTopEventsByLocation,
} from '@/src/store/slices/homeSlice';
import { AppDispatch, RootState } from '@/src/store/store';
import Header from '@/src/components/Header';
import RoleNavigation from '@/src/components/Navigation';

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.home
  );
  const { featuredEvents, featuredEventsLoading, featuredEventsError } =
    useSelector((state: RootState) => state.home);

    const {
      topEventsByLocation,
      topEventsByLocationLoading,
      topEventsByLocationError,
    } = useSelector((state: RootState) => state.home);

  useEffect(() => {
    dispatch(fetchEventCategories());
    dispatch(fetchFeaturedEvents());
    dispatch(fetchTopEventsByLocation({ location: 'lahore', limit: 10 }));
  }, [dispatch]);

  console.log('categories', featuredEvents);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' }),
    };
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Discover"
            placeholderTextColor="#666"
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {loading ? (
              <ActivityIndicator color="#FF4B55" size="small" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : categories?.data && categories.data.length > 0 ? (
              categories.data.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryItem}>
                  <View style={styles.categoryContent}>
                    <Image
                      source={{ uri: category.attachment }}
                      style={styles.categoryIcon}
                    />
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.errorText}>No categories available</Text>
            )}
          </ScrollView>
        </View>

        {/* Featured Event Card */}
        {featuredEventsLoading ? (
          <ActivityIndicator
            color="#FF4B55"
            size="large"
            style={styles.loader}
          />
        ) : featuredEventsError ? (
          <Text style={styles.errorText}>{featuredEventsError}</Text>
        ) : featuredEvents && featuredEvents.length > 0 ? (
          <View style={styles.eventCard}>
            <Image
              source={{ uri: featuredEvents[0].attachment }}
              style={styles.eventImage}
            />
            <View style={styles.dateChip}>
              <Text style={styles.dateText}>
                {formatDate(featuredEvents[0].date).day}
              </Text>
              <Text style={styles.monthText}>
                {formatDate(featuredEvents[0].date).month}
              </Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{featuredEvents[0].title}</Text>
              <Text style={styles.priceText}>
                PKR {featuredEvents[0].price}
              </Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#E1E1E1" />
              <Text style={styles.locationText}>
                {featuredEvents[0].location} |{' '}
                {formatTime(featuredEvents[0].startTime)}
              </Text>
            </View>
            <View style={styles.eventBottom}>
              <View style={styles.attendeesContainer}>
                <Text style={styles.attendeesCount}>
                  {featuredEvents[0]._count.TicketsPayment}
                </Text>
                <View style={styles.attendeeImages}>
                  <Image
                    source={{ uri: featuredEvents[0].organizer.profilePic }}
                    style={styles.attendeeImage}
                  />
                  <Image
                    source={{ uri: dummyProfilePic }}
                    style={[styles.attendeeImage, { marginLeft: -10 }]}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() =>
                  router.push(`/event-detail/${featuredEvents[0].id}`)
                }
              >
                <Text style={styles.joinButtonText}>Join Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>No featured events available</Text>
        )}

        {/* Top 10 in Lahore */}
        <View style={styles.topEventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTwoTitle}>Top 10 in Lahore</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {topEventsByLocationLoading ? (
            <ActivityIndicator color="#FF4B55" size="small" />
          ) : topEventsByLocationError ? (
            <Text style={styles.errorText}>{topEventsByLocationError}</Text>
          ) : topEventsByLocation && topEventsByLocation.length > 0 ? (
            topEventsByLocation.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.topEventCard}
                onPress={() => router.push(`/event-detail/${event.id}`)}
              >
                <Image
                  source={{ uri: event.attachment }}
                  style={styles.topEventImage}
                />
                <View style={styles.topEventDetails}>
                  <Text style={styles.topEventTitle}>{event.title}</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#E1E1E1"
                    />
                    <Text style={styles.locationText}>{event.location}</Text>
                  </View>
                  <Text style={styles.timeText}>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}{' '}
                    {formatDate(event.date).month} {formatDate(event.date).day},{' '}
                    {new Date(event.date).getFullYear()}
                  </Text>
                </View>
                <View style={styles.topEventPrice}>
                  <Text style={styles.priceText}>PKR {event.price}</Text>
                </View>
                <TouchableOpacity style={styles.topEventFavorite}>
                  <Ionicons name="heart-outline" size={24} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.errorText}>No top events found</Text>
          )}
          
        </View>
      </ScrollView>

      <RoleNavigation role="user" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Urbanist_700Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF4B55',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: 'white',
    fontSize: 16,
  },
  categoriesSection: {
    paddingRight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    marginBottom: 15,
    fontFamily: 'Urbanist_600SemiBold',
  },

  sectionTwoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',

    fontFamily: 'Urbanist_600SemiBold',
  },

  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryItem: {
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    overflow: 'hidden',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingRight: 20,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  eventCard: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 12,
    paddingBottom: 12,
  },
  eventImage: {
    width: '100%',
    height: 165,
    borderRadius: 15,
    marginBottom: 12,
  },
  dateChip: {
    position: 'absolute',
    top: 30,
    left: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Urbanist_400Regular',
  },
  monthText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Urbanist_400Regular',
  },
  favoriteButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 20,
    padding: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_400Regular',
  },
  priceText: {
    color: 'white',
    fontSize: 20,

    fontFamily: 'Urbanist_400Regular',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationText: {
    color: '#E1E1E1',
    marginLeft: 5,
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
  },
  eventBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesCount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#7C0004',
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center',
    lineHeight: 40, 
    overflow: 'hidden',
    marginRight: -8,
  },

  attendeeImages: {
    flexDirection: 'row',
  },
  
  attendeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  joinButton: {
    backgroundColor: '#BA0507',
    height: 40,
    width: 196,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 16 * 1.2,
    fontFamily: 'Urbanist_400Regular',
    letterSpacing: 2,

    textAlign: 'center',

    alignItems: 'center',
  },
  topEventsSection: {
    marginBottom: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // marginBottom: 15,
  },
  seeAllText: {
    color: '#FF4B55',
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
  },
  topEventCard: {
    padding: 12,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  topEventImage: {
    width: 80,
    borderRadius: 15,
    height: 80,
  },
  topEventDetails: {
    flex: 1,
    padding: 10,
  },
  topEventTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Urbanist_600SemiBold',
  },
  timeText: {
    color: '#E1E1E1',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Urbanist_400Regular',
  },
  topEventPrice: {
    padding: 10,
    justifyContent: 'center',
  },
  topEventFavorite: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingBottom: 25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#E1E1E1',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Urbanist_400Regular',
  },
  activeNavText: {
    color: '#FF4B55',
  },
  errorText: {
    color: '#FF4B55',
    marginLeft: 20,
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  loader: {
    marginTop: 20,
  },
});
