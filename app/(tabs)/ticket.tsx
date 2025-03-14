import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

export default function TicketScreen() {
  const router = useRouter();

  return (
    <View  style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket</Text>
        <Image source={{ uri: dummyProfilePic }} style={styles.profilePic} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          {/* Left Notch */}
          <View style={[styles.notch, styles.leftNotch]} />
          {/* Right Notch */}
          <View style={[styles.notch, styles.rightNotch]} />

          {/* Event Title */}
          <Text style={styles.eventTitle}>
            Tixly concert - The{'\n'}Immersive Experience
          </Text>

          {/* Dotted Line */}
          <View style={styles.dottedLine} />

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            {/* Row 1 */}
            <View style={styles.detailRow}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>Apr 09, 2025</Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>01:00 PM</Text>
              </View>
            </View>

            {/* Separator Line */}
            <View style={styles.separatorLine} />

            {/* Row 2 */}
            <View style={styles.detailRow}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Venue</Text>
                <Text style={styles.detailValue}>Faisal Town, Lahore</Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Hall</Text>
                <Text style={styles.detailValue}>Gold 3</Text>
              </View>
            </View>

            {/* Separator Line */}
            <View style={styles.separatorLine} />

            {/* Row 3 */}
            <View style={styles.detailRow}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Seat</Text>
                <Text style={styles.detailValue}>234 - R14 - H98</Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Order No</Text>
                <Text style={styles.detailValue}>345838</Text>
              </View>
            </View>
          </View>

          {/* Price */}
          <Text style={styles.priceText}>PKR 500</Text>

          {/* Dotted Line */}
          <View style={styles.dottedLine} />

          {/* Barcode */}
          <View style={styles.barcodeContainer}>
            {Array.from({ length: 50 }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.barcodeLine,
                  { width: Math.random() < 0.3 ? 3 : 1 }
                ]} 
              />
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.qrCodeButton}>
          <Text style={styles.qrCodeButtonText}>QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.getItButton}>
          <Text style={styles.getItButtonText}>Get it</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  ticketCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  notch: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: 'black',
    borderRadius: 12,
    top: '70%',
    marginTop: -12,
  },
  leftNotch: {
    left: -12,
  },
  rightNotch: {
    right: -12,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#000',
    fontFamily: 'Urbanist_600SemiBold',
  },
  dottedLine: {
    width: '100%',
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginVertical: 24,
  },
  detailsGrid: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Urbanist_400Regular',
  },
  detailValue: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  priceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 24,
    fontFamily: 'Urbanist_600SemiBold',
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: '100%',
    gap: 2,
  },
  barcodeLine: {
    height: '100%',
    backgroundColor: '#000',
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    gap: 12,
  },
  getItButton: {
    flex: 1,
    backgroundColor: '#FF4B55',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  getItButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  qrCodeButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  qrCodeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
}); 