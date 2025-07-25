import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import SugarCubeIcon from '@/components/SugarCubeIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { getSplashScreenFacts, SugarFact } from '@/constants/sugarEducation';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const factFadeAnim = React.useRef(new Animated.Value(1)).current;
  
  const [currentFactIndex, setCurrentFactIndex] = useState<number>(0);
  const [facts] = useState<SugarFact[]>(() => getSplashScreenFacts());
  
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
  
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(factFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(factFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
      }, 300);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [factFadeAnim, facts.length]);
  
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
        
        <Text style={styles.appName}>Sugar Cypher</Text>
        <Text style={styles.tagline}>Take Control of Your Health</Text>
        
        <View style={styles.quoteContainer}>
          <Text style={styles.inspirationalText}>
            &quot;Every small step towards better health is a victory worth celebrating.&quot;
          </Text>
        </View>
        
        <Animated.View 
          style={[
            styles.factContainer,
            { opacity: factFadeAnim }
          ]}
        >
          <Text style={styles.factTitle}>Did you know?</Text>
          <Text style={styles.factText}>
            {facts[currentFactIndex]?.content || 'Loading educational content...'}
          </Text>
          <Text style={styles.factSubtext}>
            Knowledge is power - use it to transform your health.
          </Text>
          <View style={styles.factIndicators}>
            {facts.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentFactIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </Animated.View>
        
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
  },
  factIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeIndicator: {
    backgroundColor: Colors.primary,
  }
});