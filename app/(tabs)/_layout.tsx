import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Home, Camera, BarChart, Receipt, Users, Settings, Scan } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { router } from 'expo-router';
import ShoogSniffaAvatar from '@/components/ShoogSniffaAvatar';

function CustomDrawerContent(props: any) {
  const routes = [
    { name: 'index', title: 'Today', icon: Home },
    { name: 'log', title: 'Log Food', icon: Camera },
    { name: 'scanner', title: 'Scanner', icon: Scan },
    { name: 'insights', title: 'Insights', icon: BarChart },
    { name: 'shopping', title: 'Shopping', icon: Receipt },
    { name: 'community', title: 'Community', icon: Users },
    { name: 'settings', title: 'Settings', icon: Settings },
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
                switch (route.name) {
                  case 'index':
                    router.push('/(tabs)/');
                    break;
                  case 'log':
                    router.push('/(tabs)/log');
                    break;
                  case 'scanner':
                    router.push('/(tabs)/scanner');
                    break;
                  case 'insights':
                    router.push('/(tabs)/insights');
                    break;
                  case 'shopping':
                    router.push('/(tabs)/shopping');
                    break;
                  case 'community':
                    router.push('/(tabs)/community');
                    break;
                  case 'settings':
                    router.push('/(tabs)/settings');
                    break;
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
        name="index"
        options={{
          title: 'Today',
          drawerLabel: 'Today',
        }}
      />
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



