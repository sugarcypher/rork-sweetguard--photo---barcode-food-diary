import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Search, Shield, AlertTriangle } from 'lucide-react-native';

interface SugarCypherIconProps {
  size?: number;
  color?: string;
}

export default function SugarCubeIcon({ size = 24, color = '#32CD32' }: SugarCypherIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer protective ring */}
      <View style={[styles.outerRing, { 
        width: size, 
        height: size,
        borderColor: '#14B8A6',
        borderRadius: size / 2
      }]} />
      
      {/* Inner shield background */}
      <View style={[styles.shieldBg, { 
        width: size * 0.7, 
        height: size * 0.7,
        backgroundColor: 'rgba(50, 205, 50, 0.2)',
        borderRadius: size * 0.35
      }]} />
      
      {/* Main shield icon */}
      <View style={styles.iconContainer}>
        <Shield 
          size={size * 0.4} 
          color={color} 
          fill={`${color}40`}
        />
      </View>
      
      {/* Search magnifier overlay */}
      <View style={[styles.searchOverlay, {
        top: size * 0.15,
        right: size * 0.15
      }]}>
        <Search 
          size={size * 0.25} 
          color={'#FFD700'} 
          strokeWidth={3}
        />
      </View>
      
      {/* Warning indicator */}
      <View style={[styles.warningIndicator, {
        bottom: size * 0.1,
        left: size * 0.1
      }]}>
        <AlertTriangle 
          size={size * 0.2} 
          color={'#FF6B8B'} 
          fill={'rgba(255, 107, 139, 0.3)'}
        />
      </View>
      
      {/* Pulse effect rings */}
      <View style={[styles.pulseRing1, { 
        width: size * 1.2, 
        height: size * 1.2,
        borderColor: 'rgba(20, 184, 166, 0.3)',
        borderRadius: size * 0.6
      }]} />
      
      <View style={[styles.pulseRing2, { 
        width: size * 1.4, 
        height: size * 1.4,
        borderColor: 'rgba(20, 184, 166, 0.15)',
        borderRadius: size * 0.7
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 3,
    zIndex: 1,
  },
  shieldBg: {
    position: 'absolute',
    zIndex: 2,
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchOverlay: {
    position: 'absolute',
    zIndex: 4,
  },
  warningIndicator: {
    position: 'absolute',
    zIndex: 4,
  },
  pulseRing1: {
    position: 'absolute',
    borderWidth: 2,
    zIndex: 0,
  },
  pulseRing2: {
    position: 'absolute',
    borderWidth: 1,
    zIndex: 0,
  }
});