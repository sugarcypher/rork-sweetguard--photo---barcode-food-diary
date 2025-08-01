import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Camera, BarChart, Receipt, Users, Settings, Scan, Sparkles, TrendingUp } from 'lucide-react-native';
import { useTourStore } from '@/store/tourStore';
import OnboardingTour from '@/components/OnboardingTour';

const { width } = Dimensions.get('window');

export default function TabsIndex() {
  const router = useRouter();
  const { showTour, initializeTour, completeTour } = useTourStore();
  
  useEffect(() => {
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
    { 
      title: 'Food Log', 
      icon: Camera, 
      route: '/log', 
      description: 'Track your daily food intake',
      gradient: Colors.gradientPrimary,
      featured: true
    },
    { 
      title: 'Scanner', 
      icon: Scan, 
      route: '/scanner', 
      description: 'Scan food items and barcodes',
      gradient: Colors.gradientSecondary,
      featured: true
    },
    { 
      title: 'Insights', 
      icon: BarChart, 
      route: '/insights', 
      description: 'View your sugar consumption analytics',
      gradient: Colors.gradientSuccess
    },
    { 
      title: 'Shopping', 
      icon: Receipt, 
      route: '/shopping', 
      description: 'Smart shopping assistance',
      gradient: Colors.gradientDanger
    },
    { 
      title: 'Community', 
      icon: Users, 
      route: '/community', 
      description: 'Connect with others',
      gradient: ['#8B5CF6', '#EC4899'] as const
    },
    { 
      title: 'Settings', 
      icon: Settings, 
      route: '/settings', 
      description: 'App preferences and account',
      gradient: ['#6B7280', '#374151'] as const
    },
  ];
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#EC4899'] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroIcon}>
            <Sparkles size={32} color="white" />
          </View>
          <Text style={styles.heroTitle}>SugarCypher</Text>
          <Text style={styles.heroSubtitle}>Decode Hidden Sugars, Live Healthier</Text>
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <TrendingUp size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>Track Progress</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      
      {/* Featured Actions */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.featuredGrid}>
          {menuItems.filter(item => item.featured).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.featuredItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={item.gradient}
                  style={styles.featuredGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.featuredIcon}>
                    <IconComponent size={28} color="white" />
                  </View>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <Text style={styles.featuredDescription}>{item.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* All Features */}
      <View style={styles.allFeaturesSection}>
        <Text style={styles.sectionTitle}>All Features</Text>
        <View style={styles.menuGrid}>
          {menuItems.filter(item => !item.featured).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.cardElevated, Colors.surface] as const}
                  style={styles.menuItemGradient}
                >
                  <View style={styles.iconContainer}>
                    <LinearGradient
                      colors={item.gradient}
                      style={styles.iconGradient}
                    >
                      <IconComponent size={24} color="white" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      <OnboardingTour
        visible={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Hero Section
  heroGradient: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // Featured Section
  featuredSection: {
    padding: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 20,
  },
  featuredGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  featuredItem: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredGradient: {
    padding: 24,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  featuredDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // All Features Section
  allFeaturesSection: {
    padding: 24,
    paddingTop: 8,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  menuItem: {
    width: (width - 64) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItemGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 16,
  },
});