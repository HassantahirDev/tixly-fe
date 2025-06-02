import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { homeApi } from '@/src/services/api';

// Types
interface TicketPayment {
  id: string;
  amount: number;
  quantity: number;
  status: string;
  userId: string;
  eventId: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  attachment: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  location: string;
  price: number;
  TicketsPayment: TicketPayment[];
}

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';
const dummyConcertImage =
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80';

const dates = [
  { day: 'Sun', date: '23' },
  { day: 'Sun', date: '23' },
  { day: 'Sun', date: '23' },
  { day: 'Tue', date: '23', active: true },
  { day: 'Sun', date: '23' },
];

export default function AdminTicketsScreen() {
  const [selectedIdx, setSelectedIdx] = useState(
    dates.findIndex((d) => d.active) || 0
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await homeApi.getAllEvents();
      setEvents(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString(),
      fullDate: date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const calculateTicketStats = (ticketsPayment: TicketPayment[]) => {
    if (!ticketsPayment || ticketsPayment.length === 0) {
      return { sold: 0, remaining: 0 };
    }

    const approvedTickets = ticketsPayment.filter(ticket => ticket.status === 'APPROVED');
    const totalSold = approvedTickets.reduce((sum: number, ticket: TicketPayment) => sum + ticket.quantity, 0);
    
    return {
      sold: totalSold,
      remaining: 0 // We don't have capacity info in this response, so setting to 0
    };
  };

  return (
    <View style={styles.container}>
      {/* Header and Date Selector */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <Text style={styles.logo}>TiXLY</Text>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <TouchableOpacity onPress={() => router.push('/admin/notifications')}>
                <Ionicons name="notifications-outline" size={24} color="white" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push('/admin/profile')}>
              <Image
                source={{ uri: dummyProfilePic }}
                style={styles.profilePic}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.ticketsTitle}>Tickets</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateSelector}
        >
          {dates.map((d, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dateItem,
                selectedIdx === idx && styles.activeDateItem,
              ]}
              onPress={() => setSelectedIdx(idx)}
              activeOpacity={0.8}
            >
              {selectedIdx === idx ? (
                <LinearGradient
                  colors={['#7F0102', '#0B0179']}
                  style={styles.gradientBg}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                >
                  <Text style={[styles.dateDay, styles.activeDateDay]}>
                    {d.day}
                  </Text>
                  <Text style={[styles.dateNum, styles.activeDateNum]}>
                    {d.date}
                  </Text>
                </LinearGradient>
              ) : (
                <>
                  <Text style={styles.dateDay}>{d.day}</Text>
                  <Text style={styles.dateNum}>{d.date}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Tickets List */}
      <ScrollView style={styles.ticketsList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF4B55" />
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchEvents} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        ) : (
          events.map((event) => {
            const dateInfo = formatDate(event.date);
            const timeInfo = formatTime(event.startTime);
            const ticketStats = calculateTicketStats(event.TicketsPayment);

            return (
              <View key={event.id} style={styles.ticketCard}>
                {/* Top: Event image and title */}
                <View style={styles.ticketHeaderRow}>
                  <Image
                    source={{ uri: event.attachment || dummyConcertImage }}
                    style={styles.ticketCardImage}
                  />
                  <Text style={styles.ticketCardTitle}>{event.title}</Text>
                </View>
                {/* Physical Ticket Section */}
                <View style={styles.physicalTicketWrapper}>
                  {/* Punched notches (top and bottom) */}
                  <View style={styles.punchNotchTop} />
                  <View style={styles.physicalTicketContentRow}>
                    <View style={styles.physicalTicketLeft}>
                      <Text style={styles.ticketSubtitlePhysical}>
                        {event.description.length > 50 
                          ? event.description.substring(0, 50) + '...' 
                          : event.description}
                      </Text>
                      <View style={styles.ticketLocationRowPhysical}>
                        <Ionicons
                          name="location-outline"
                          size={18}
                          color="#BDBDBD"
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.ticketLocationPhysical}>
                          {event.location} | {timeInfo}
                        </Text>
                      </View>
                      <View style={styles.ticketDatePriceRowPhysical}>
                        <Text style={styles.ticketDatePhysical}>{dateInfo.fullDate}</Text>
                        <Text style={styles.ticketPricePhysical}>
                          PKR {event.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* Dotted line positioned under punch notches */}
                  <View style={styles.dottedLineContainer}>
                    <View style={styles.dottedLine} />
                  </View>
                  {/* Barcode section */}
                  <View style={styles.barcodeContainer}>
                    <View style={styles.barcodeScanner}>
                      {/* Simulate barcode lines */}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.barcodeLine,
                            {
                              height: 70,
                              backgroundColor: i % 3 === 0 ? '#232323' : '#111',
                              width: i % 4 === 0 ? 3 : 2,
                              marginHorizontal: 1,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.punchNotchBottom} />
                </View>
                {/* Bottom: Stats */}
                <View style={styles.ticketStatsRow}>
                  <View style={styles.ticketStatContainer}>
                    <Text style={styles.ticketStatLabelPhysical}>Tickets Sold</Text>
                    <View style={styles.ticketStatBoxPhysical}>
                      <Text style={styles.ticketStatValuePhysical}>
                        {ticketStats.sold}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ticketStatContainer}>
                    <Text style={styles.ticketStatLabelPhysical}>
                      Event Capacity
                    </Text>
                    <View style={styles.ticketStatBoxPhysical}>
                      <Text style={styles.ticketStatValuePhysical}>
                        {event.capacity || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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
          <Ionicons name="calendar-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/tickets')}
        >
          <Ionicons name="ticket-outline" size={24} color="#FF4B55" />
          <Text style={[styles.navText, styles.activeNavText]}>Tickets</Text>
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
    flex: 1,
    backgroundColor: 'black',
  },
  activeNavText: {
    color: '#FF4B55',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingBottom: 25,
    position: 'absolute',
    marginTop: 400,
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
  fixedHeader: {
    backgroundColor: 'black',
    paddingTop: 15,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'Urbanist_700Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#BA0507',
    borderRadius: 8,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  
  },
  ticketsTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: 'Urbanist_700Bold',
  },
  dateSelector: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#181818',
  },
  activeDateItem: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  gradientBg: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    color: '#BDBDBD',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Urbanist_500Medium',
  },
  dateNum: {
    color: '#BDBDBD',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
  },
  activeDateDay: {
    color: 'white',
    fontFamily: 'Urbanist_500Medium',
  },
  activeDateNum: {
    color: 'white',
    fontFamily: 'Urbanist_700Bold',
  },
  ticketsList: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  ticketCard: {
    backgroundColor: '#181818',
    borderRadius: 20,
    marginBottom: 24,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  ticketCardImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 14,
  },
  ticketCardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'Urbanist_700Bold',
  },
  physicalTicketWrapper: {
    backgroundColor: '#E5E5E5',
    borderRadius: 18,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 12,
    minHeight: 110,
    position: 'relative',
    overflow: 'visible',
  },
  physicalTicketContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingLeft: 18,
    paddingRight: 0,
  },
  physicalTicketLeft: {
    flex: 1,
    maxWidth: '65%', // Ensure content doesn't cross the dotted line
    paddingRight: 8,
  },
  ticketSubtitlePhysical: {
    color: '#232323',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 14, // Increased by 15% (4 * 1.15)
    fontFamily: 'Urbanist_700Bold',
  },
  ticketLocationRowPhysical: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14, // Increased by 15% (4 * 1.15)
  },
  ticketLocationPhysical: {
    color: '#232323',
    fontSize: 13,
    // fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
  ticketDatePriceRowPhysical: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketDatePhysical: {
    color: '#232323',
    fontSize: 13,
    // fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
  ticketPricePhysical: {
    color: '#232323',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
  },
  punchNotchTop: {
    position: 'absolute',
    top: -12,
    left: '70%',
    marginLeft: -16,
    width: 32,
    height: 24,
    backgroundColor: '#181818',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 2,
  },
  punchNotchBottom: {
    position: 'absolute',
    bottom: -12,
    left: '70%',
    marginLeft: -16,
    width: 32,
    height: 24,
    backgroundColor: '#181818',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 2,
  },
  ticketDividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 18,
  },
  dottedLineContainer: {
    position: 'absolute',
    left: '70%',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dottedLine: {
    width: 2,
    height: 80,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 1,
  },
  barcodeContainer: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeScanner: {
    width: 54,
    height: 80,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
  },
  barcodeLine: {
    height: 70,
    backgroundColor: '#232323',
    borderRadius: 1,
  },
  ticketStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  ticketStatContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  ticketStatBoxPhysical: {
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 90,
    backgroundColor: 'transparent',
    width: '100%',
  },
  ticketStatLabelPhysical: {
    color: '#BDBDBD',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
  ticketStatValuePhysical: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Urbanist_400Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    color: '#FF4B55',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Urbanist_400Regular',
  },
  retryButton: {
    backgroundColor: '#FF4B55',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#BDBDBD',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Urbanist_400Regular',
  },
});
