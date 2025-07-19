import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import SugarCubeIcon from '@/components/SugarCubeIcon';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const handleGetStarted = () => {
    router.replace('/(tabs)');
  };
  
  return (
    <LinearGradient
      colors={[Colors.background, '#0A0A0A']}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <SugarCubeIcon size={80} color={Colors.primary} />
        </View>
        
        <Text style={styles.appName}>Sugar Tracker</Text>
        <Text style={styles.tagline}>Take Control of Your Health</Text>
        
        <View style={styles.quoteContainer}>
          <Text style={styles.inspirationalText}>
            &quot;Every small step towards better health is a victory worth celebrating.&quot;
          </Text>
        </View>
        
        <View style={styles.factContainer}>
          <Text style={styles.factTitle}>Did you know?</Text>
          <Text style={styles.factText}>
            15 million deaths per year are directly or indirectly caused by excessive sugar consumption.
          </Text>
          <Text style={styles.factSubtext}>
            But you have the power to change that story.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              I am ready to reduce my sugar intake!
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          Start your journey to a healthier, sugar-conscious lifestyle today.
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 350,
  },
  iconContainer: {
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '500',
  },
  quoteContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  inspirationalText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  factContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  factTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.danger,
    marginBottom: 8,
    textAlign: 'center',
  },
  factText: {
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  factSubtext: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  getStartedButton: {
    width: '100%',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  }
});