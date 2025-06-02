import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const dummyProfilePic1 = 'https://randomuser.me/api/portraits/men/1.jpg';

export default function OrganizerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  // Dummy data for demonstration
  const organizer = {
    name: 'Username',
    profilePic: dummyProfilePic1,
    memberSince: '24 Feb',
    totalEvents: 23,
    events: [
      {
        id: '1',
        title: 'Tixly concert - Atif Aslam',
        location: 'Bahria Town, Lahore',
        date: '2025-04-08T20:00:00Z',
        price: 500,
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '2',
        title: 'Tixly concert - Atif Aslam',
        location: 'Bahria Town, Lahore',
        date: '2025-04-08T20:00:00Z',
        price: 500,
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '3',
        title: 'Tixly concert - Atif Aslam',
        location: 'Bahria Town, Lahore',
        date: '2025-04-08T20:00:00Z',
        price: 500,
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      },
    ],
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  ${date.toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' })}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <Image source={{ uri: organizer.profilePic }} style={styles.profilePicSmall} />
          </View>
        </View>
        {/* Profile */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Image source={{ uri: organizer.profilePic }} style={styles.profilePicLarge} />
          <Text style={styles.organizerName}>{organizer.name}</Text>
          <Text style={styles.memberSince}>Member since {organizer.memberSince}</Text>
        </View>
        {/* Contact Button */}
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsText}>Total No of Successful Events Organized by {organizer.name.toLowerCase()}.</Text>
          <Text style={styles.statsCount}>{organizer.totalEvents}+</Text>
        </View>
        {/* All Events */}
        <View style={styles.eventsHeader}>
          <Text style={styles.allEventsTitle}>All Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        {organizer.events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="location-outline" size={14} color="#E1E1E1" />
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="time-outline" size={14} color="#E1E1E1" />
                <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
              </View>
            </View>
            <Text style={styles.eventPrice}>PKR {event.price}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
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
  profilePicSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePicLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  organizerName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
    marginTop: 8,
  },
  memberSince: {
    color: '#E1E1E1',
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 8,
  },
  contactButton: {
    backgroundColor: '#BA0507',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 18,
    marginBottom: 18,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Urbanist_400Regular',
    letterSpacing: 1.2,
  },
  statsCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    marginHorizontal: 12,
    padding: 18,
    marginBottom: 18,
  },
  statsText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 8,
  },
  statsCount: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Urbanist_600SemiBold',
    textAlign: 'right',
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  allEventsTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
  },
  seeAllText: {
    color: '#FF4B55',
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 14,
    padding: 12,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  eventTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 2,
  },
  eventLocation: {
    color: '#E1E1E1',
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
    marginLeft: 4,
  },
  eventDate: {
    color: '#E1E1E1',
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
    marginLeft: 4,
  },
  eventPrice: {
    color: '#BA0507',
    fontSize: 18,
    fontFamily: 'Urbanist_600SemiBold',
    marginLeft: 8,
  },
});
