import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

export default function Header() {
  const router = useRouter();

  const handleNotificationClick = () => {
    router.push('/(tabs)/settings/notification');
  };

  const handleProfileClick = () => {
    router.push('/(tabs)/settings/profile');
  };

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>TiXLY</Text>
      <View style={styles.headerRight}>
        <View style={styles.notificationBadge}>
          <TouchableOpacity onPress={handleNotificationClick}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleProfileClick}>
          <Image source={{ uri: dummyProfilePic }} style={styles.profilePic} />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {},
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
});
