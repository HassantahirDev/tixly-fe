import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface TicketCardProps {
  title: string;
  location: string;
  time: string;
  date: string;
  price: string;
  barcode: React.ReactNode;
}

const TicketCard: React.FC<TicketCardProps> = ({
  title,
  location,
  time,
  date,
  price,
  barcode,
}) => {
  return (
    <LinearGradient
      colors={['rgba(127, 1, 2, 0.7)', 'rgba(11, 1, 121, 0.7)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientContainer}
    >
      <View style={styles.ticketCard}>
        {/* Top notch */}
        <View style={[styles.notch, styles.topNotch]} />
        {/* Bottom notch */}
        <View style={[styles.notch, styles.bottomNotch]} />
        {/* Vertical dotted line */}
        <View style={styles.dottedLine} />

        <View style={styles.ticketContent}>
          <View style={styles.leftSection}>
            <Text style={styles.ticketTitle}>{title}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#999" />
              <Text style={styles.locationText}>
                {location} | {time}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>{date}</Text>
              <Text style={styles.priceText}>{price}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <View style={styles.barcodeSection}>{barcode}</View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default TicketCard;

const styles = StyleSheet.create({
  gradientContainer: {
    minHeight: 136,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
  },
  ticketCard: {
    backgroundColor: '#E1E1E1',
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 112,
  },
  notch: {
    width: 24,
    height: 24,
    backgroundColor: '#4A1D3A',
    position: 'absolute',
    left: '75%',
    marginLeft: -12,
    borderRadius: 12,
    zIndex: 1,
  },
  topNotch: {
    top: -12,
  },
  bottomNotch: {
    bottom: -12,
  },
  dottedLine: {
    position: 'absolute',
    left: '75%',
    top: 0,
    bottom: 0,
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#B8B8B8',
    zIndex: 0,
  },
  ticketContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftSection: {
    width: '75%',
    padding: 12,
  },
  rightSection: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#020202',
    marginBottom: 10,
    fontFamily: 'Urbanist_600SemiBold',
    maxWidth: 206,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14.5,
  },
  locationText: {
    color: '#949494',
    marginLeft: 5,
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
  },
  dateRow: {
    flexDirection: 'row',
    gap: '16%',
    alignItems: 'center',
  },
  dateText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
    minWidth: 70,
  },
  priceText: {
    color: '#BA0507',
    fontSize: 18,
    letterSpacing: 0.04 * 12,
    lineHeight: 14,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
    minWidth: 70,
  },
  barcodeSection: {
    transform: [{ rotate: '90deg' }],
  },
});
