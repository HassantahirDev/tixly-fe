import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Barcode from '../../src/components/barcode';
import Header from '@/src/components/Header';
import RoleNavigation from '@/src/components/Navigation';

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

const tickets = [
  {
    id: 1,
    title: 'Tixly concert - The Immersive Experience',
    location: 'Bahria Town, Lahore',
    time: '04:00 PM',
    date: '12 Apr, 2025',
    price: 'PKR 500',
  },
  {
    id: 2,
    title: 'Tixly concert - The Immersive Experience',
    location: 'Bahria Town, Lahore',
    time: '04:00 PM',
    date: '12 Apr, 2025',
    price: 'PKR 500',
  },
  {
    id: 3,
    title: 'Tixly concert - The Immersive Experience',
    location: 'Bahria Town, Lahore',
    time: '04:00 PM',
    date: '12 Apr, 2025',
    price: 'PKR 500',
  },
  {
    id: 4,
    title: 'Tixly concert - The Immersive Experience',
    location: 'Bahria Town, Lahore',
    time: '04:00 PM',
    date: '12 Apr, 2025',
    price: 'PKR 500',
  },
];

export default function TicketsScreen() {
  return (
    <LinearGradient colors={['#4A1D3A', '#21152C']} style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {tickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketCard}>
            {/* Left notch */}
            <View style={[styles.notch, styles.leftNotch]} />
            {/* Right notch */}
            <View style={[styles.notch, styles.rightNotch]} />
            {/* Dotted line */}
            <View style={styles.dottedLine} />

            <View style={styles.ticketContent}>
              <Text style={styles.ticketTitle}>{ticket.title}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color="#999" />
                <Text style={styles.locationText}>
                  {ticket.location} | {ticket.time}
                </Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateText}>{ticket.date}</Text>
                <Text style={styles.priceText}>{ticket.price}</Text>
              </View>
              <View style={styles.barcodeSection}>
                <Barcode />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <RoleNavigation role="user" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
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
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  notch: {
    width: 24,
    height: 24,
    backgroundColor: '#4A1D3A',
    position: 'absolute',
    top: '50%',
    marginTop: -12,
    borderRadius: 12,
    zIndex: 1,
  },
  leftNotch: {
    left: -12,
  },
  rightNotch: {
    right: -12,
  },
  dottedLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    zIndex: 0,
  },
  ticketContent: {
    padding: 16,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Urbanist_600SemiBold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    color: '#999',
    marginLeft: 4,
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
  },
  priceText: {
    color: '#BA0507',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  barcodeSection: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
