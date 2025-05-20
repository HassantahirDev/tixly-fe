import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../../src/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootState } from '@/src/store/store';
import { useSelector } from 'react-redux';

const Jiguy = require('../../../src/assets/images/jiguy.svg');
const event = require('../../../src/assets/images/event.png');

const dummyAtifImage =
  'https://s3-alpha-sig.figma.com/img/7195/35ce/20f435aa2aaf485222099fce2f34d806?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Z7vsJ4RSbBm5X2gDZ4JDc8QI6boZjGG2GLzr0dgYVU9IF7fillNg41LCNgh1p5sxA1-rvDBeWVUN4-D5VlDr1dA0R-kpFT54nribowJeQTtXob1dtnQxN2lck5~954vrVGDzBdc4Ks7ynFIbxirPzvCUn1Px0fpMgYfB-6aFKjoY7V4eYn~iCQbXsCJaYYGJe9wNErsk1E0Q3oq8QOtKi4ltwQglcdg4QKz5LGnOuz4FTw8CqQHHKoucvTVU2G3UkxoJkMSzkjMaPbMjQl7LuncyGLU3fhB6nHlFDuMGScGFPL~ZLWY~5SNqvn3rjdzZjXUzUm8gcDV-0fqJBmB4AA__';

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

type Event = {
  id: number;
  attachment: string;
  date: string;
  title: string;
  price: number;
  location: string;
  startTime: string;
  _count: {
    TicketsPayment: string;
  };
  organizer: {
    profilePic: string;
  };
};

const featuredEvents: Event[] = [
  {
    id: 1,
    attachment: 'https://via.placeholder.com/400x200',
    date: '2025-04-02T18:00:00',
    startTime: '2025-04-02T18:00:00',
    title: 'Tixly concert',
    price: 2500,
    location: 'Bahria Town, Lahore',
    _count: {
      TicketsPayment: '1.2K',
    },
    organizer: {
      profilePic: dummyProfilePic,
    },
  },
];

const categories = [
  {
    id: '1',
    name: 'Tourism',
    attachment:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhHv0dXgq7ROB-5mUTV6VdSpVicEei6iCT4Q&s',
  },
  {
    id: '2',
    name: 'Literature',
    attachment:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOoQrTMq3oWoxwH-W3mEY6cmRxXk_ANbcVuA&s',
  },
  {
    id: '3',
    name: 'Exhibition',
    attachment:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlQCPrJP7yc9sWpppMDUoadLwYbGwvEpwj_Q&s',
  },
  {
    id: '4',
    name: 'Science Fiction',
    attachment:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlQCPrJP7yc9sWpppMDUoadLwYbGwvEpwj_Q&s',
  },
];

const organizerHome: React.FC = () => {
  const router = useRouter();
  // const { featuredEvents, featuredEventsLoading, featuredEventsError } =
  //   useSelector((state: RootState) => state.home);

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
      <Header />
      <ScrollView>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            autoFocus={false}
            style={styles.searchInput}
            placeholder="Discover"
            placeholderTextColor="#E1E1E1"
          />
        </View>
        <View style={styles.centerContainer}>
          <LinearGradient
            colors={['rgba(127, 1, 2, 0.7)', 'rgba(11, 1, 121, 0.7)']}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View>
              <Image source={Jiguy} style={styles.image} resizeMode="cover" />
              <Text style={styles.overlayText}>
                Bring Your Event to Life – Plan, Manage, and Sell Tickets with
                Ease!
              </Text>
            </View>
            <TouchableOpacity style={styles.eventButton}>
              <Text style={styles.eventButtonText}>Create Event</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.length === 0 ? (
              <Text style={styles.errorText}>No categories available</Text>
            ) : (
              categories.map((category) => (
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
            )}
          </ScrollView>
        </View>

        <LinearGradient
          colors={['rgba(127, 1, 2, 0.7)', 'rgba(11, 1, 121, 0.7)']}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={styles.eventCard}
        >
          <Image source={event} style={styles.eventImage} />
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
            <Text style={styles.priceText}>PKR {featuredEvents[0].price}</Text>
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
              <View style={styles.attendeeCountContainer}>
                <Text style={styles.attendeesCount}>
                  {featuredEvents[0]._count.TicketsPayment}
                </Text>
              </View>
              <View style={styles.attendeeImages}>
                <Image
                  source={{
                    uri: 'https://randomuser.me/api/portraits/men/1.jpg',
                  }}
                  style={styles.attendeeImage}
                />
                <Image
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTANH8-R3R74SaxS7BLFPnnar8LzX02fW2NvQ&s',
                  }}
                  style={[styles.attendeeImage, { marginLeft: -10 }]}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => console.log('Join event pressed')}
            >
              <Text style={styles.joinButtonText}>Join Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Top 10 in Lahore */}
        <View style={styles.topEventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTwoTitle}>Top 10 in Lahore</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.topEventCard}>
            <Image
              source={{ uri: dummyAtifImage }}
              style={styles.topEventImage}
            />
            
            <View style={styles.topEventDetails}>
              <Text style={styles.topEventTitle}>
                Tixly concert - Atif Aslam
              </Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#E1E1E1" />
                <Text style={styles.locationText}>Bahria Town, Lahore</Text>
              </View>
              <Text style={styles.timeText}>
                08:00 PM - 10:00 PM Apr 08, 2025
              </Text>
            </View>
            <View style={styles.topEventPrice}>
              <Text style={styles.priceText}>PKR 500</Text>
            </View>
            <TouchableOpacity style={styles.topEventFavorite}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default organizerHome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E166',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
    color: '#E1E1E1',
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#E1E1E1',
    fontSize: 16,
    borderWidth: 0,
    // @ts-ignore
    outlineStyle: 'none',
  },
  centerContainer: {
    alignItems: 'center',
    marginHorizontal: 18,
  },
  gradientContainer: {
    width: '100%',
    height: 241,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingTop: 12,

    position: 'relative',
  },
  image: {
    width: '100%',
    height: 165,
    borderRadius: 12,
  },
  overlayText: {
    position: 'absolute',
    fontFamily: 'Urbanist_400Regular',
    fontSize: 16,
    lineHeight: 15 * 1.2,
    bottom: 0,
    left: 12,
    letterSpacing: 2,
    right: 12,
    color: '#E1E1E1',
    textAlign: 'left',
    paddingBottom: 14,
  },
  eventButton: {
    marginTop: 10,
    backgroundColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  eventButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    letterSpacing: 2,
  },
  categoriesSection: {
    paddingRight: 20,
    marginTop: 21,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E1E1E1',
    marginLeft: 20,
    marginBottom: 15,
    fontFamily: 'Urbanist_600SemiBold',
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  errorText: {
    marginTop: 20,
    color: '#FF4B55',
    marginLeft: 20,
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
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
    color: '#E1E1E1',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  loader: {
    marginTop: 20,
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
  eventCard: {
    margin: 20,
    backgroundColor:
      'linear-gradient(127.64deg, rgba(127, 1, 2, 0.7) 1.8%, rgba(11, 1, 121, 0.7) 114.83%)',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 12,
    paddingBottom: 12,
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
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 16 * 1.2,
    fontFamily: 'Urbanist_400Regular',
    letterSpacing: 2,
    textAlign: 'center',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#BA0507',
    height: 40,
    width: 196,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 24,
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
  attendeeCountContainer: {
    backgroundColor: '#7C0004',
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendeesCount: {
    color: '#F0F0F0',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  attendeeImages: {
    flexDirection: 'row',
  },
  attendeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  favoriteButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 20,
    padding: 8,
  },

  topEventsSection: {
    marginBottom: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  seeAllText: {
    color: '#E1E1E1',
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
  },
  topEventCard: {
    padding: 12,
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
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
    letterSpacing: 2,
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
  sectionTwoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Urbanist_600SemiBold',
  },
});
