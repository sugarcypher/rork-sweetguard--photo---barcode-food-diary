import { Drawer, DrawerContentComponentProps } from 'expo-router/drawer';
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { X, Home, BarChart, Camera, Settings, Users, Receipt } from "lucide-react-native";
import { useRouter } from 'expo-router';
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: Colors.card,
          width: 250,
        },
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
      drawerContent={(props: DrawerContentComponentProps) => {
        const router = useRouter();
        return (
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity
                onPress={() => props.navigation.closeDrawer()}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.drawerContent}>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  router.push('./index');
                  props.navigation.closeDrawer();
                }}
              >
                <Home size={24} color={Colors.subtext} />
                <Text style={styles.drawerText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  router.push('./log');
                  props.navigation.closeDrawer();
                }}
              >
                <Camera size={24} color={Colors.subtext} />
                <Text style={styles.drawerText}>Log Food</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  router.push('./insights');
                  props.navigation.closeDrawer();
                }}
              >
                <BarChart size={24} color={Colors.subtext} />
                <Text style={styles.drawerText}>Insights</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  router.push('./shopping');
                  props.navigation.closeDrawer();
                }}
              >
                <Receipt size={24} color={Colors.subtext} />
                <Text style={styles.drawerText}>Shopping</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  router.push('./community');
                  props.navigation.closeDrawer();
                }}
              >
                <Users size={24} color={Colors.subtext} />
                <Text style={styles.drawerText}>Community</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  router.push('./settings');
                  props.navigation.closeDrawer();
                }}
              >
                <Settings size={24} color={Colors.subtext} />
                <Text style={styles.drawerText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    >
      <Drawer.Screen name="index" />
      <Drawer.Screen name="log" />
      <Drawer.Screen name="insights" />
      <Drawer.Screen name="shopping" />
      <Drawer.Screen name="community" />
      <Drawer.Screen name="settings" />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerText: {
    marginLeft: 16,
    fontSize: 16,
    color: Colors.text,
  },
});