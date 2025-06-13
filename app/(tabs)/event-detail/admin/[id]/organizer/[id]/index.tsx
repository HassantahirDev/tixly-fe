import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { organizerApi } from '@/src/services/api';

const fallbackProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

export default function OrganizerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [organizer, setOrganizer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    organizerApi.getOrganizerById(id as string)
      .then((res: any) => {
        if (res?.data?.success) {
          setOrganizer(res.data.data);
        } else {
          setError('Failed to fetch organizer');
        }
      })
      .catch(() => setError('Failed to fetch organizer'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  ${date.toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <View style={styles.container}><ActivityIndicator color="#fff" size="large" /></View>
    );
  }
  if (error || !organizer) {
    return (
      <View style={styles.container}><Text style={{ color: 'white', textAlign: 'center', marginTop: 40 }}>{error || 'Organizer not found'}</Text></View>
    );
  }

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
            <Image source={{ uri: organizer.profilePic || fallbackProfilePic }} style={styles.profilePicSmall} />
          </View>
        </View>
        {/* Profile */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Image source={{ uri: organizer.profilePic || fallbackProfilePic }} style={styles.profilePicLarge} />
          <Text style={styles.organizerName}>{organizer.name}</Text>
          <Text style={styles.memberSince}>Member since {organizer.createdAt ? formatDate(organizer.createdAt) : ''}</Text>
        </View>
        {/* Contact Button */}
        <TouchableOpacity style={styles.contactButton} onPress={() => setShowContactModal(true)}>
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsText}>Total No of Successful Events Organized by {organizer.name?.toLowerCase()}.</Text>
          <Text style={styles.statsCount}>{organizer.successfulEventsCount}</Text>
        </View>
        {/* All Events */}
        <View style={styles.eventsHeader}>
          <Text style={styles.allEventsTitle}>All Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        {organizer.eventsCreated && organizer.eventsCreated.length > 0 ? (
          organizer.eventsCreated.map((event: any) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => router.push(`/event-detail/admin/${event.id}`)}
            >
              <Image source={{ uri: event.image || fallbackProfilePic }} style={styles.eventImage} />
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
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>No events found.</Text>
        )}
      </ScrollView>
      {/* Contact Modal */}
      <Modal
        visible={showContactModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowContactModal(false)} />
        <View style={styles.modalContent}>
          <Image source={{ uri: organizer.profilePic || fallbackProfilePic }} style={styles.modalProfilePic} />
          <Text style={styles.modalName}>{organizer.name}</Text>
          <Text style={styles.modalEmail}>{organizer.email}</Text>
          <Text style={styles.modalMemberSince}>Member since {organizer.createdAt ? formatDate(organizer.createdAt) : ''}</Text>
          <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowContactModal(false)}>
            <Text style={styles.closeModalBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    position: 'absolute',
    top: '30%',
    left: 24,
    right: 24,
    backgroundColor: '#232323',
    borderRadius: 20,
    alignItems: 'center',
    padding: 28,
    zIndex: 10,
  },
  modalProfilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  modalName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Urbanist_600SemiBold',
  },
  modalEmail: {
    color: '#E1E1E1',
    fontSize: 15,
    marginBottom: 8,
    fontFamily: 'Urbanist_400Regular',
  },
  modalMemberSince: {
    color: '#E1E1E1',
    fontSize: 13,
    marginBottom: 18,
    fontFamily: 'Urbanist_400Regular',
  },
  closeModalBtn: {
    backgroundColor: '#BA0507',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  closeModalBtnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
  },
});
