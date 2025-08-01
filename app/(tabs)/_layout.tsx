import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Camera, BarChart, Receipt, Users, Settings, Scan } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { useRouter } from 'expo-router';
import ShoogSniffaAvatar from '@/components/ShoogSniffaAvatar';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  
  const routes = [
    { name: 'log', title: 'Log Food', icon: Camera, path: '/(tabs)/log' },
    { name: 'scanner', title: 'Scanner', icon: Scan, path: '/(tabs)/scanner' },
    { name: 'insights', title: 'Insights', icon: BarChart, path: '/(tabs)/insights' },
    { name: 'shopping', title: 'Shopping', icon: Receipt, path: '/(tabs)/shopping' },
    { name: 'community', title: 'Community', icon: Users, path: '/(tabs)/community' },
    { name: 'settings', title: 'Settings', icon: Settings, path: '/(tabs)/settings' },
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <ShoogSniffaAvatar size={60} />
        <Text style={styles.drawerTitle}>Sugar Tracker</Text>
        <Text style={styles.drawerSubtitle}>Stay healthy with AI</Text>
      </View>
      
      <ScrollView style={styles.drawerContent}>
        {routes.map((route) => {
          const IconComponent = route.icon;
          const isActive = props.state.routeNames[props.state.index] === route.name;
          
          return (
            <TouchableOpacity
              key={route.name}
              style={[styles.drawerItem, isActive && styles.drawerItemActive]}
              onPress={() => {
                try {
                  router.push(route.path as any);
                } catch (error) {
                  console.warn('Navigation error:', error);
                }
              }}
            >
              <IconComponent 
                size={24} 
                color={isActive ? Colors.primary : Colors.subtext} 
              />
              <Text style={[styles.drawerItemText, isActive && styles.drawerItemTextActive]}>
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerTintColor: Colors.text,
        drawerStyle: {
          backgroundColor: Colors.background,
          width: 280,
        },
        headerLeft: () => null,
      }}
    >

      <Drawer.Screen
        name="log"
        options={{
          title: 'Log Food',
          drawerLabel: 'Log Food',
        }}
      />
      <Drawer.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          drawerLabel: 'Scanner',
        }}
      />
      <Drawer.Screen
        name="insights"
        options={{
          title: 'Insights',
          drawerLabel: 'Insights',
        }}
      />
      <Drawer.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          drawerLabel: 'Shopping',
        }}
      />
      <Drawer.Screen
        name="community"
        options={{
          title: 'Community',
          drawerLabel: 'Community',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerLabel: 'Settings',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 10,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 4,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  drawerItemActive: {
    backgroundColor: Colors.primary + '20',
  },
  drawerItemText: {
    fontSize: 16,
    color: Colors.subtext,
    marginLeft: 15,
  },
  drawerItemTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});



