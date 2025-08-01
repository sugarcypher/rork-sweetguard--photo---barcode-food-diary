import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const INITIALIZATION_STEPS = [
  'Initializing...',
  'Removing sugar...',
  'Activating AI...',
  'Loading cypher...'
];

export default function InitializationScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  useEffect(() => {
    console.log('InitializationScreen mounted');
    
    // Step progression with simpler logic
    let step = 0;
    const totalSteps = INITIALIZATION_STEPS.length;
    
    const stepInterval = setInterval(() => {
      step++;
      if (step < totalSteps) {
        setCurrentStep(step);
      } else {
        clearInterval(stepInterval);
        setIsComplete(true);
        setTimeout(() => {
          console.log('Navigating to splash screen');
          router.push('/splash');
        }, 1300); // Combined delay for completion and navigation
      }
    }, 800);
    
    return () => {
      console.log('InitializationScreen cleanup');
      clearInterval(stepInterval);
    };
  }, [router]);
  
  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#334155']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <View style={styles.logoGlow} />
          <Image 
            source={{ uri: 'https://r2-pub.rork.com/attachments/9lyjtgl4i9xajqkfxrdlx' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* App Name */}
        <Text style={styles.appName}>SugarCypher</Text>
        
        {/* Loading Text */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isComplete ? 'Ready!' : INITIALIZATION_STEPS[currentStep]}
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill,
                {
                  width: `${((currentStep + 1) / INITIALIZATION_STEPS.length) * 100}%`,
                }
              ]}
            />
          </View>
        </View>
        
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { opacity: currentStep >= index ? 1 : 0.3 }
              ]}
            />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  logoGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: '#E2E8F0',
    marginBottom: 60,
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif-medium',
  },
  loadingContainer: {
    height: 30,
    justifyContent: 'center',
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif',
  },
  progressBarContainer: {
    width: 200,
    marginBottom: 40,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
});