import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { homeApi } from '@/src/services/api';

export default function AdminEventsScreen() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = params.mode;
  const heading =
    params.heading ||
    (mode === 'upcoming'
      ? 'Upcoming Events'
      : mode === 'ongoing'
      ? 'Ongoing Events'
      : 'Pending Approvals');
  const hideApproval = params.hideApproval === 'true';
  const isSpecialMode = mode === 'upcoming' || mode === 'ongoing';

  useEffect(() => {
    let fetchEvents;
    setLoading(true);
    if (params.events) {
      // If events are passed via navigation (for See All), use them
      setEvents(JSON.parse(params.events as string));
      setLoading(false);
      return;
    }
    if (mode === 'upcoming') {
      fetchEvents = homeApi.getUpcomingEvents();
    } else if (mode === 'ongoing') {
      fetchEvents = homeApi.getOngoingEvents();
    } else {
      // Default: fetch all events for admin approval
      fetchEvents = homeApi.getAllEvents
        ? homeApi.getAllEvents()
        : homeApi.getUpcomingEvents();
    }
    fetchEvents
      .then((res: any) => {
        let data = res.data?.data || [];
        // Sort: not-approved events first (approvedByAdmin: false)
        data = data.sort((a: any, b: any) => {
          if (a.approvedByAdmin === b.approvedByAdmin) return 0;
          return a.approvedByAdmin ? 1 : -1;
        });
        setEvents(data);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [mode, params.events]);

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={[styles.fixedHeader, isSpecialMode && { paddingBottom: 0 }]}>
        <View style={styles.header}>
          <Text style={styles.logo}>TiXLY</Text>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <TouchableOpacity
                onPress={() => router.push('/admin/notifications')}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="white"
                />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push('/admin/profile')}>
              <Image
                source={{
                  uri: events[0]?.organizer?.profilePic ||
                  'https://randomuser.me/api/portraits/men/1.jpg',
                }}
                style={styles.profilePic}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.pendingTitle}>{heading}</Text>
        {/* Hide date filter for upcoming and ongoing modes */}
        {!isSpecialMode && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateSelector}
          >
            {/* Date filter UI can be implemented if needed */}
          </ScrollView>
        )}
      </View>
      {/* Approval/Event Cards */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: isSpecialMode ? 100 : 130,
        }}
      >
        <View style={{ marginBottom: 80 }}>
          {loading ? (
            <Text
              style={{ color: 'white', textAlign: 'center', marginTop: 40 }}
            >
              Loading events...
            </Text>
          ) : events.length === 0 ? (
            <Text
              style={{ color: 'white', textAlign: 'center', marginTop: 40 }}
            >
              No events found.
            </Text>
          ) : (
            events.map((event: any) => (
              <TouchableOpacity
                key={event.id}
                style={styles.approvalCard}
                onPress={() => router.push(`/event-detail/admin/${event.id}`)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <Image
                    source={{
                      uri: event.organizer?.profilePic ||
                      'https://randomuser.me/api/portraits/men/1.jpg',
                    }}
                    style={styles.cardAvatar}
                  />
                  <View>
                    <Text style={styles.cardUsername}>
                      {event.organizer?.name || 'Username'}
                    </Text>
                  </View>
                </View>
                {mode === 'ongoing' || mode === 'upcoming' ? (
                  // Show event detail card for ongoing/upcoming events
                  <>
                    <Text style={styles.cardEventName}>{event.title}</Text>
                    <Text style={styles.cardRequest}>{event.location}</Text>
                    <Text style={styles.cardRequest}>
                      {new Date(event.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(event.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    <Text style={styles.cardRequest}>PKR {event.price}</Text>
                    <TouchableOpacity
                      style={styles.detailsBtn}
                      onPress={(e) => {
                        e.stopPropagation && e.stopPropagation();
                        router.push(`/event-detail/admin/${event.id}`);
                      }}
                    >
                      <Text style={styles.detailsBtnText}>Event details</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  // Default approval card for pending events
                  <>
                    <Text style={styles.cardRequest}>
                      <Text style={styles.cardUsername}>
                        {event.organizer?.name || 'Username'}
                      </Text>{' '}
                      wants to organize an event named{' '}
                      <Text style={styles.cardEventName}>“{event.title}”</Text>
                    </Text>
                    {/* Details button always visible, Approve/Decline only for not approved */}
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.detailsBtn}
                        onPress={(e) => {
                          e.stopPropagation && e.stopPropagation();
                          router.push(`/event-detail/admin/${event.id}`);
                        }}
                      >
                        <Text style={styles.detailsBtnText}>Details</Text>
                      </TouchableOpacity>
                      {!hideApproval && event.approvedByAdmin === false ? (
                        <>
                          <TouchableOpacity style={styles.declineBtn}>
                            <Text style={styles.declineBtnText}>Decline</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.approveBtn}>
                            <Text style={styles.approveBtnText}>Approve</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <Text style={{ color: '#4CAF50', fontWeight: 'bold', marginTop: 10 }}>Approved</Text>
                      )}
                    </View>
                  </>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/home')}
        >
          <Ionicons name="home" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/events')}
        >
          <Ionicons name="calendar-outline" size={24} color="#FF4B55" />
          <Text style={[styles.navText, styles.activeNavText]}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/tickets')}
        >
          <Ionicons name="ticket-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/settings')}
        >
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
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    zIndex: 10,
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
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
  pendingTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: 'Urbanist_600SemiBold',
  },
  dateSelector: {
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 20,
  },
  dateItem: {
    backgroundColor: '#232323',
    borderRadius: 10, // reduced from 20
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 55,
    height: 55,
  },
  activeDateItem: {
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0,
    borderRadius: 10, // match reduced border radius
  },
  gradientBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10, // match reduced border radius
    width: 55,
    height: 55,
  },
  dateDay: {
    color: 'white',
    fontSize: 10, // reduced from 15
    fontFamily: 'Urbanist_400Regular',
    opacity: 0.7,
  },
  dateNum: {
    color: 'white',
    fontSize: 14, // reduced from 22
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
    marginTop: 2,
  },
  activeDateDay: {
    color: 'white',
    fontWeight: 'bold',
    opacity: 1,
  },
  activeDateNum: {
    color: 'white',
    fontWeight: 'bold',
    opacity: 1,
  },
  approvalCard: {
    backgroundColor: '#232323',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  cardUsername: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Urbanist_600SemiBold',
  },
  cardMemberSince: {
    color: '#E1E1E1',
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
  },
  cardRequest: {
    color: 'white',
    fontSize: 14,
    marginBottom: 16,
    marginTop: 2,
    fontFamily: 'Urbanist_400Regular',
  },
  cardEventName: {
    fontWeight: 'bold',
    color: 'white',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsBtn: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  detailsBtnText: {
    color: '#E1E1E1',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Urbanist_400Regular',
  },
  declineBtn: {
    borderWidth: 1,
    borderColor: '#FF4B55',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  declineBtnText: {
    color: '#FF4B55',
    fontSize: 15,
    fontFamily: 'Urbanist_400Regular',
  },
  approveBtn: {
    backgroundColor: '#FF4B55',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  approveBtnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Urbanist_400Regular',
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
});
