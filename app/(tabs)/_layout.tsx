import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Home, Camera, BarChart, Receipt, Users, Settings, Scan } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { navigation, state } = props;
  
  const menuItems = [
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
        <Text style={styles.drawerTitle}>SugarCypher</Text>
      </View>
      {menuItems.map((item, index) => {
        const isActive = state.index === index;
        const IconComponent = item.icon;
        
        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.drawerItem, isActive && styles.drawerItemActive]}
            onPress={() => {
              navigation.navigate(item.name as any);
              navigation.closeDrawer();
            }}
          >
            <IconComponent 
              size={24} 
              color={isActive ? Colors.primary : Colors.subtext} 
            />
            <Text style={[styles.drawerItemText, isActive && styles.drawerItemTextActive]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerTintColor: Colors.text,
        headerLeft: () => null,
        drawerStyle: {
          backgroundColor: Colors.card,
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Today',
        }}
      />
      <Drawer.Screen
        name="log"
        options={{
          title: 'Log Food',
        }}
      />
      <Drawer.Screen
        name="insights"
        options={{
          title: 'Insights',
        }}
      />
      <Drawer.Screen
        name="shopping"
        options={{
          title: 'Shopping',
        }}
      />
      <Drawer.Screen
        name="community"
        options={{
          title: 'Community',
        }}
      />
      <Drawer.Screen
        name="scanner"
        options={{
          title: 'Scanner',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    paddingTop: 50,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
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
    marginLeft: 15,
    fontSize: 16,
    color: Colors.subtext,
  },
  drawerItemTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

});

