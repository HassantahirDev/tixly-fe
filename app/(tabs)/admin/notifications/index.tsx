import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router'; // <-- Add this import
import SettingsScreen from '.';
const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

const ticketData = [
  {
    id: 1,
    ticketNumber: '7675738',
    event: 'Tixly Concert',
    date: 'April 15, 2025',
    location: 'Bahria Town',
    time: '7:45 PM',
    bookedAt: '06:23 PM',
  },
  {
    id: 2,
    ticketNumber: '9823412',
    event: 'Rock Fest',
    date: 'May 22, 2025',
    location: 'Downtown Arena',
    time: '8:30 PM',
    bookedAt: '02:15 PM',
  },
  {
    id: 3,
    ticketNumber: '4598371',
    event: 'Jazz Night',
    date: 'June 10, 2025',
    location: 'City Hall',
    time: '6:00 PM',
    bookedAt: '09:45 AM',
  },
  {
    id: 4,
    ticketNumber: '9823412',
    event: 'Rock Fest',
    date: 'May 22, 2025',
    location: 'Downtown Arena',
    time: '8:30 PM',
    bookedAt: '02:15 PM',
  },
  {
    id: 5,
    ticketNumber: '4598371',
    event: 'Jazz Night',
    date: 'June 10, 2025',
    location: 'City Hall',
    time: '6:00 PM',
    bookedAt: '09:45 AM',
  },
  {
    id: 6,
    ticketNumber: '9823412',
    event: 'Rock Fest',
    date: 'May 22, 2025',
    location: 'Downtown Arena',
    time: '8:30 PM',
    bookedAt: '02:15 PM',
  },
  {
    id: 7,
    ticketNumber: '4598371',
    event: 'Jazz Night',
    date: 'June 10, 2025',
    location: 'City Hall',
    time: '6:00 PM',
    bookedAt: '09:45 AM',
  },
];

export default function NotificationScreen() {
  const [showSettingScreen, setshowSettingScreen] = useState(false);
  const router = useRouter(); // <-- Add this line

  const handleNotificationClick = () => {
    setshowSettingScreen(true);
  };

  if (showSettingScreen) {
    return <SettingsScreen />;
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Notifications</Text>
          <View style={styles.headerRight}>
            <Image
              source={{ uri: dummyProfilePic }}
              style={styles.profilePic}
            />
          </View>
        </View>
        <View>
          <Text style={styles.dateText}>Monday, 22 April 2025</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View>
          {ticketData.map((ticket) => (
            <View key={ticket.id} style={styles.ticketContainer}>
              <Text style={styles.ticketText}>
                Your ticket No.{' '}
                <Text style={styles.boldText}>{ticket.ticketNumber}</Text> for
                the
                {ticket.event} on{' '}
                <Text style={styles.boldText}>{ticket.date}</Text>, at
                <Text style={styles.boldText}> {ticket.location}</Text> at
                <Text style={styles.boldText}> {ticket.time}</Text> has been
                confirmed.
              </Text>
              <Text style={styles.timeText}>{ticket.bookedAt}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: 'black',
  },
  headerText: {
    fontFamily: 'Urbanist_600SemiBold',
    color: '#F0F0F0',
    fontSize: 16,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dateText: {
    fontFamily: 'Urbanist_400Regular',
    color: '#F5F5F5',
    fontSize: 16,
    paddingLeft: 18,
  },
  buyButton: {
    width: 125,
    height: 51,
    backgroundColor: '#BA0507',
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 19,
  },
  buyButtonText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },
  ticketContainer: {
    paddingTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingBottom: 29,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#949494',
    marginHorizontal: 19,
  },

  ticketText: {
    fontFamily: 'Urbanist_400Regular',
    flex: 1,
    fontSize: 14,
    lineHeight: 16 * 1.37,
    color: '#949494',
  },

  boldText: {
    fontFamily: 'Urbanist_600SemiBold',
    fontWeight: 'bold',
    lineHeight: 16 * 1.37,
    fontSize: 14,
    color: '#E1E1E1',
  },

  timeText: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 12,
    color: '#949494',
    marginLeft: 10,
  },
});
