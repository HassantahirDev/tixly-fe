import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { Dimensions } from 'react-native';
import Barcode from './barcode';

type TicketDetailCardProps = {
  title: string;
  date: string;
  time: string;
  venue: string;
  hall: string;
  seat: string;
  orderNo: string;
  price: string;
  onClickGotIt: () => void;
};

const screenHeight = Dimensions.get('window').height;
const ticketCardHeight = screenHeight - 180;

const TicketDetailCard: React.FC<TicketDetailCardProps> = ({
  title,
  date,
  time,
  venue,
  hall,
  seat,
  orderNo,
  price,
  onClickGotIt
}) => {

  return (
    <View style={styles.MainContainer}>
      <LinearGradient
        colors={['rgba(127, 1, 2, 0.7)', 'rgba(11, 1, 121, 0.7)']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={styles.eventCard}
      >
        <View style={styles.container}>
        <View style={styles.leftNotch} />
  {/* Right Half Circle */}
  <View style={styles.rightNotch} />
          <View style={styles.ticket}>
            <Text style={styles.title}>{title}</Text>
            <View style={[styles.row, {}]}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.label}>Time</Text>
            </View>
            <View style={[styles.row, {
              borderBottomColor: '#B8B8B8',
              borderBottomWidth: 1,
              paddingBottom: 18

            }]}>
              <Text style={styles.value}>{date}</Text>
              <Text style={styles.value}>{time}</Text>
            </View>
            <View style={[styles.row, {}]}>
              <Text style={styles.label}>Venue</Text>
              <Text style={styles.label}>Hall</Text>
            </View>
            <View style={[styles.row, {
              borderBottomColor: '#B8B8B8',
              borderBottomWidth: 1,
              paddingBottom: 18

            }]}>
              <Text style={styles.value}>{venue}</Text>
              <Text style={styles.value}>{hall}</Text>
            </View>
            <View style={[styles.row, {}]}>
              <Text style={styles.label}>Seat</Text>
              <Text style={styles.label}>Order No</Text>
            </View>
            <View style={[styles.row, {
              borderBottomColor: '#B8B8B8',
              borderBottomWidth: 1,
              paddingBottom: 18

            }]}>
              <Text style={styles.value}>{seat}</Text>
              <Text style={styles.value}>{orderNo}</Text>
            </View>

            <Text style={styles.price}>PKR {price}</Text>

            {/* Simulated Barcode */}
            <View style={styles.barcodeMain}>
              <Barcode width={229} height={108} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.qrButton}>
          <Text style={styles.qrText}>QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.getButton} onPress={onClickGotIt}>
          <Text style={styles.getText}>Get it</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TicketDetailCard;

const styles = StyleSheet.create({
  MainContainer: {
    height: ticketCardHeight,
    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    height: "100%",
  },

  eventCard: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 10,
    paddingBottom: 12,
    height: "100%"
  },
  ticket: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    padding: 20,
    height: "100%",
    position: 'relative',
    overflow:"hidden"
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    color: '#020202',
    borderBottomColor: '#B8B8B8',
    borderStyle: "dashed",
    borderBottomWidth: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 15,
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: '400',
    color: '#020202',
  },
  price: {
    textAlign: 'center',
    color: '#BA0507',
    fontSize: 30,
    fontWeight: '700',
    marginVertical: 22,
  },
  barcode: {
    height: 108,
    backgroundColor: '#000',
    marginTop: 8,
    borderRadius: 4,

  },
  barcodeMain: {
    paddingTop: 19,
    borderTopColor: '#B8B8B8',
    borderStyle: "dashed",
    borderTopWidth: 1,
    justifyContent:'center',
    alignItems:"center"
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 9,
    paddingHorizontal: 20
  },
  qrButton: {
    borderWidth: 1,
    borderColor: '#c40000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    flex: 1,
    alignItems: "center",
    display: "flex"
  },
  getButton: {
    backgroundColor: '#c40000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    flex: 1,
    alignItems: "center",
    display: "flex"
  },
  qrText: {
    color: '#c40000',
    fontWeight: 'bold',
    textAlign: "center",
  },
  getText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: "center"
  },

  leftNotch: {
    position: 'absolute',
    left: -7,
    bottom: '24.6%',
    width: 40,
    height: 40,
    backgroundColor: '#4A1D3A',
    borderRadius: 20,
    zIndex: 10,
  },
  
  rightNotch: {
    position: 'absolute',
    right: -7,
    bottom: '24.6%',
    width: 40,
    height: 40,
    backgroundColor: '#4A1D3A',
    borderRadius: 20,
    zIndex: 10,
  },
  
});
