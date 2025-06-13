import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import SettingsScreen from '.';
import { notificationApi } from '@/src/services/api';
import { jwtDecode } from 'jwt-decode';

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

export default function NotificationScreen() {
  const [showSettingScreen, setshowSettingScreen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  // Fetch notifications and userId
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || '';
        const decoded: any = jwtDecode(token);
        const id = decoded?.sub || '';
        setUserId(id);
        if (!id) return;
        const res = await notificationApi.getUserNotifications(id);
        setNotifications(res.data.data || []);
        // Store notification count in localStorage
        localStorage.setItem('notificationCount', String((res.data.data || []).length));
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Handler for "Clear All" button
  const handleClearAll = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await notificationApi.markAllAsRead(userId);
      // Refresh notifications after marking as read
      const res = await notificationApi.getUserNotifications(userId);
      // Update notifications state with the response
      localStorage.setItem('notificationCount', '0'); // Reset notification count
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error('Failed to mark notifications as read', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setshowSettingScreen(true);
  };

  if (showSettingScreen) {
    return <SettingsScreen />;
  }
  const hasNotifications = notifications.length > 0;
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
          <Text style={styles.dateText}>{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
        </View>
        {hasNotifications && (
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity style={styles.buyButton} onPress={handleClearAll}>
              <Text style={styles.buyButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#BA0507" />
          </View>
        ) : hasNotifications ? (
          <View>
            {notifications.map((notification: any) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.ticketContainer}
                onPress={() => {
                  if (notification.event?.id) {
                    router.push(`/event-detail/admin/${notification.event.id}`);
                  }
                }}
              >
                <Text style={styles.ticketText}>
                  Event <Text style={styles.boldText}>{notification.event?.title}</Text> was created by organizer <Text style={styles.boldText}>{notification.user?.name}</Text> in <Text style={styles.boldText}>{notification.event?.location}</Text> at <Text style={styles.boldText}>{notification.event?.startTime ? new Date(notification.event.startTime).toLocaleString() : ''}</Text>.
                </Text>
                <Text style={styles.timeText}>{notification.createdAt ? new Date(notification.createdAt).toLocaleTimeString() : ''}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#949494', fontSize: 16 }}>No notifications</Text>
          </View>
        )}
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
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
