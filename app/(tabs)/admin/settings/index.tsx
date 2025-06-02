import { AntDesign, Ionicons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import NotificationScreen from '../notifications';
import ProfileSettingScreen from '../profile';
import { useRouter } from 'expo-router';

const Terms = require('../../../../src/assets/images/Terms.svg');
const Voucher = require('../../../../src/assets/images/Voucher.svg');
const Privacy = require('../../../../src/assets/images/Privacy.svg');

export default function SettingsScreen() {
  const [isdeleteAccount, setIsdeleteAccount] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>TiXLY</Text>
        <View style={styles.headerRight}>
          <View style={styles.notificationBadge}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profilePic}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* <Header /> */}
        <View style={styles.settingContainer}>
          <View style={styles.settingRow}>
            <View style={styles.leftContainer}>
              <Ionicons
                name="notifications-outline"
                size={16}
                color="#E1E1E1"
              />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#E1E1E1" />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.leftContainer}>
              <Image source={Voucher} style={styles.voucherImage} />
              <Text style={styles.settingText}>Vouchers</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#E1E1E1" />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.leftContainer}>
              <Image source={Terms} style={styles.Privacy} />
              <Text style={styles.settingText}>Terms & Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#E1E1E1" />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.leftContainer}>
              <Image source={Privacy} style={styles.Privacy} />
              <Text style={styles.settingText}>Privacy Policies</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#E1E1E1" />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.leftContainer}>
              <SimpleLineIcons name="question" size={13} color="#E1E1E1" />
              <Text style={styles.settingText}>Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#E1E1E1" />
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setIsdeleteAccount(true)}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => setIsLogout(true)}
        >
          <Text style={styles.buyButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {isdeleteAccount && (
        <View style={styles.ticketOverlay}>
          <View style={styles.ticketOverlayContent}>
            <View style={styles.ticketHeader}>
              <TouchableOpacity>
                <AntDesign name="arrowleft" size={24} color="#F0F0F0" />
              </TouchableOpacity>
              <Text style={styles.ticketTitle}>Delete Account</Text>
              <TouchableOpacity
                style={styles.ticketCloseButton}
                onPress={() => setIsdeleteAccount(false)}
              >
                <AntDesign name="close" size={24} color="#F0F0F0" />
              </TouchableOpacity>
            </View>
            <View style={styles.ticketSeparator} />
          </View>
          <Text style={styles.deleteText}>
            Do you want to delete this account permanently?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsdeleteAccount(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isLogout && (
        <View style={styles.ticketOverlay}>
          <View style={styles.ticketOverlayContent}>
            <View style={styles.ticketHeader}>
              <TouchableOpacity>
                <AntDesign name="arrowleft" size={24} color="#F0F0F0" />
              </TouchableOpacity>
              <Text style={styles.ticketTitle}>Logout</Text>
              <TouchableOpacity
                style={styles.ticketCloseButton}
                onPress={() => setIsLogout(false)}
              >
                <AntDesign name="close" size={24} color="#F0F0F0" />
              </TouchableOpacity>
            </View>
            <View style={styles.ticketSeparator} />
          </View>
          <Text style={styles.deleteText}>
            Do you want to logout this account account?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsLogout(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* <RoleNavigation role="user" /> */}
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
          <Text style={[styles.navText]}>Events</Text>
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
          <Ionicons name="settings-outline" size={24} color="#FF4B55" />
          <Text style={[styles.navText, styles.activeNavText]}>Settings</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
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
  settingContainer: {
    marginHorizontal: 15,
    marginTop: 27,
    width: 'auto',
    height: 'auto',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#949494',
    paddingHorizontal: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 16,
    marginLeft: 10,
    color: '#E1E1E1',
  },
  voucherImage: {
    width: 15,
    height: 12,
  },
  Privacy: {
    width: 9.6,
    height: 12,
  },
  buyButton: {
    marginTop: 25,
    backgroundColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 18,
  },
  buyButtonText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },
  deleteButtonText: {
    color: '#BA0507',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 25.5,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  cancelButton: {
    width: '48%',
    height: 51,
    borderWidth: 1,
    borderColor: '#BA0507',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    paddingTop: 4,
    color: '#BA0507',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },
  updateButton: {
    width: '48%',
    height: 51,
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#BA0507',
  },
  updateButtonText: {
    paddingTop: 4,
    color: '#F0F0F0',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },

  ticketOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
    zIndex: 50,
  },
  ticketOverlayContent: {
    width: '100%',
    alignItems: 'center',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    paddingVertical: 15,
  },
  ticketTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#F0F0F0',
    letterSpacing: 1,
  },
  ticketCloseButton: {
    padding: 10,
  },
  ticketSeparator: {
    width: '95%',
    height: 1,
    backgroundColor: '#949494',
    alignSelf: 'center',
    marginBottom: 21,
  },
  deleteText: {
    marginHorizontal: 31,
    color: '#F0F0F0',
    fontFamily: 'Urbanist_400Regular',
    fontSize: 14,
    marginBottom: 24,
    letterSpacing: 0.04 * 12,
  },
});
