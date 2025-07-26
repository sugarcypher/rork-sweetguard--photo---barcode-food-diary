import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import SugarCubeIcon from '@/components/SugarCubeIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { getRandomFact, getRandomQuote, SugarFact, InspirationalQuote } from '@/constants/sugarEducation';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  const [currentFact] = useState<SugarFact>(() => getRandomFact());
  const [currentQuote] = useState<InspirationalQuote>(() => getRandomQuote());
  
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
  }, [fadeAnim, slideAnim]);
  

  
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
        
        <Text style={styles.appName}>SugarCypher</Text>
        <Text style={styles.tagline}>Take Control of Your Health</Text>
        
        <View style={styles.quoteContainer}>
          <Text style={styles.inspirationalText}>
            &quot;{currentQuote.text}&quot;
          </Text>
          {currentQuote.author && (
            <Text style={styles.quoteAuthor}>
              — {currentQuote.author}
            </Text>
          )}
        </View>
        
        <View style={styles.factContainer}>
          <Text style={styles.factTitle}>Did you know?</Text>
          <Text style={styles.factText}>
            {currentFact.content}
          </Text>
          <Text style={styles.factSubtext}>
            Knowledge is power - use it to transform your health.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
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
    fontWeight: '900',
    color: '#32CD32',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -1,
    textShadowColor: 'rgba(50, 205, 50, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Futura' : 'sans-serif-condensed',
  },
  tagline: {
    fontSize: 18,
    color: '#FFDAB9',
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '500',
  },
  quoteContainer: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#14B8A6',
  },
  inspirationalText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  factContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  factTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
    textAlign: 'center',
  },
  factText: {
    fontSize: 15,
    color: '#FFFFE0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  factSubtext: {
    fontSize: 14,
    color: '#FFFFE0',
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
    color: '#FFDAB9',
    textAlign: 'center',
    lineHeight: 20,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#14B8A6',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 8,
    fontStyle: 'italic',
  }
});