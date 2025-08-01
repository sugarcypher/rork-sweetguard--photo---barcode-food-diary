import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Camera, BarChart, Receipt, Users, Settings, Scan } from 'lucide-react-native';
import { useTourStore } from '@/store/tourStore';
import OnboardingTour from '@/components/OnboardingTour';

export default function TabsIndex() {
  const router = useRouter();
  const { showTour, initializeTour, completeTour } = useTourStore();
  
  useEffect(() => {
    // Initialize tour when component mounts
    console.log('TabsIndex component mounted, initializing tour...');
    const initTour = async () => {
      try {
        await initializeTour();
        console.log('Tour initialization completed in TabsIndex');
      } catch (error) {
        console.error('Error initializing tour in TabsIndex:', error);
      }
    };
    
    initTour();
  }, [initializeTour]);
  
  const handleTourComplete = () => {
    console.log('Tour completed from home screen');
    completeTour();
  };
  
  const handleTourSkip = () => {
    console.log('Tour skipped from home screen');
    completeTour();
  };
  
  const menuItems = [
    { title: 'Food Log', icon: Camera, route: '/log', description: 'Track your daily food intake' },
    { title: 'Scanner', icon: Scan, route: '/scanner', description: 'Scan food items and barcodes' },
    { title: 'Insights', icon: BarChart, route: '/insights', description: 'View your sugar consumption analytics' },
    { title: 'Shopping', icon: Receipt, route: '/shopping', description: 'Smart shopping assistance' },
    { title: 'Community', icon: Users, route: '/community', description: 'Connect with others' },
    { title: 'Settings', icon: Settings, route: '/settings', description: 'App preferences and account' },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SugarCypher</Text>
        <Text style={styles.subtitle}>Your Sugar Tracking Dashboard</Text>
      </View>
      
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IconComponent size={32} color={Colors.primary} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <OnboardingTour
        visible={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  menuItem: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 16,
  },
});