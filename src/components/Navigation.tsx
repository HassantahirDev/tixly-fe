import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Role = 'user' | 'organizer';

interface RoleNavigationProps {
  role: Role;
}

export default function RoleNavigation({ role }: RoleNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const basePath = role === 'organizer' ? '/organizer' : '';

  const navItems: {
    name: string;
    icon: 'home' | 'heart-outline' | 'ticket-outline' | 'settings-outline';
    path: string;
  }[] = [
    {
      name: 'Home',
      icon: 'home',
      path: role === 'organizer' ? '/organizer/home' : '/',
    },
    { name: 'Favorites', icon: 'heart-outline', path: `${basePath}/favorites` },
    { name: 'Tickets', icon: 'ticket-outline', path: `${basePath}/tickets` },
    {
      name: 'Settings',
      icon: 'settings-outline',
      path: `${basePath}/settings`,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.bottomNav}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={() => router.push(item.path)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={isActive ? '#FF4B55' : '#E1E1E1'}
              />
              <Text style={[styles.navText, isActive && styles.activeNavText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
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
    borderTopWidth: 1,
    borderTopColor: '#949494',
  },
  navItem: {
    alignItems: 'center',
    paddingTop: 10,
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
