import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';
const dummyConcertImage = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80';

export default function AdminHomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>TiXLY</Text>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <Image source={{ uri: dummyProfilePic }} style={styles.profilePic} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchInput}>
            Discover
          </Text>
        </View>

        {/* Admin Event Management Card */}
        <View style={styles.eventCard}>
          <Image source={{ uri: dummyConcertImage }} style={styles.eventImage} />
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>Effortless Event Management</Text>
          </View>
          <Text style={styles.eventDesc}>
            Monitor, Approve, and Optimize with Ease!
          </Text>
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage all Events</Text>
          </TouchableOpacity>
        </View>

        {/* Categories (Admin View) */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 20 }}>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryContent}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80' }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>Tourism</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryContent}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=80&q=80' }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>Literature</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryContent}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80' }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>Exhibition</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryContent}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=80&q=80' }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>Culture</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryContent}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=80&q=80' }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>Concerts</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryContent}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80' }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>Food & Drink</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryContent}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=80&q=80' }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>Live Shows</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryContent}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=80&q=80' }} style={styles.categoryIcon} />
                <Text style={styles.categoryText}>Activities</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }] }>
              <Ionicons name="add" size={24} color="#222" style={{ marginRight: 8, marginLeft: 4 }} />
              <Text style={[styles.categoryText, { color: '#222' }]}>Add New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Event (Admin) - Match user featured event card UI exactly */}
        <View style={styles.topEventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTwoTitle}>Live Event</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.eventCard, { backgroundColor: '#232323', margin: 20, borderRadius: 28, padding: 0, paddingBottom: 0 }]}> 
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: dummyConcertImage }} style={[styles.eventImage, { borderRadius: 24, margin: 0, width: '100%', height: 180 }]} />
              <View style={{ position: 'absolute', top: 16, left: 16, backgroundColor: '#BA0507', borderRadius: 16, width: 54, height: 54, alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, lineHeight: 20 }}>02</Text>
                <Text style={{ color: 'white', fontSize: 13, lineHeight: 16 }}>Apr</Text>
              </View>
              <TouchableOpacity style={{ position: 'absolute', top: 16, right: 16, backgroundColor: '#232323', borderRadius: 16, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <Ionicons name="heart-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ padding: 20, paddingBottom: 0 }}>
              <View style={[styles.eventHeader, { marginBottom: 8 }]}> 
                <Text style={[styles.eventTitle, { color: 'white', fontSize: 20, fontWeight: 'bold', fontFamily: 'Urbanist_400Regular' }]}>Tixly concert</Text>
                <Text style={[styles.priceText, { color: 'white', fontSize: 22, fontFamily: 'Urbanist_400Regular' }]}>PKR 500</Text>
              </View>
              <View style={[styles.locationContainer, { marginBottom: 10 }]}> 
                <Ionicons name="location-outline" size={16} color="#E1E1E1" />
                <Text style={[styles.locationText, { color: '#E1E1E1', marginLeft: 5, fontSize: 14 }]}>Bahria Town, Lahore | 04:00 PM</Text>
              </View>
              <View style={[styles.eventBottom, { marginTop: 0, marginBottom: 10 }]}> 
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ backgroundColor: '#BA0507', borderRadius: 20, width: 48, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>1.2K</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: dummyProfilePic }} style={[styles.attendeeImage, { width: 40, height: 40, borderRadius: 20, marginLeft: 0 }]} />
                    <Image source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }} style={[styles.attendeeImage, { width: 40, height: 40, borderRadius: 20, marginLeft: -10 }]} />
                  </View>
                </View>
                <TouchableOpacity style={[styles.joinButton, { backgroundColor: '#BA0507', height: 40, width: 196, borderRadius: 25, paddingVertical: 8, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }]}> 
                  <Text style={[styles.joinButtonText, { color: 'white', fontSize: 16, fontFamily: 'Urbanist_400Regular', letterSpacing: 2, textAlign: 'center' }]}>Join Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#FF4B55" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    overflow: 'hidden',
    paddingRight: 32, // increased from 20 to 32 for more width
    paddingVertical: 4,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingRight: 0,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
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
  eventDesc: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Urbanist_400Regular',
  },
  manageButton: {
    backgroundColor: '#BA0507',
    height: 40,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    letterSpacing: 2,
    textAlign: 'center',
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  timeText: {
    color: '#E1E1E1',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Urbanist_400Regular',
  },
  locationText: {
    color: '#E1E1E1',
    fontSize: 12,
    marginLeft: 5,
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
  priceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  dateChip: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#BA0507',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  monthText: {
    color: 'white',
    fontSize: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  eventBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -10,
  },
  joinButton: {
    backgroundColor: '#FF4B55',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  attendeesCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  attendeeImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeCountBadge: {
    backgroundColor: '#BA0507',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendeeCountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
