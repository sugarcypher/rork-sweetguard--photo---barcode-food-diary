import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface SugarCubeIconProps {
  size?: number;
  color?: string;
}

export default function SugarCubeIcon({ size = 24, color = Colors.primary }: SugarCubeIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Main cube face */}
      <View style={[styles.face, styles.front, { 
        width: size * 0.8, 
        height: size * 0.8,
        backgroundColor: color,
        borderRadius: size * 0.1
      }]} />
      
      {/* Top face */}
      <View style={[styles.face, styles.top, { 
        width: size * 0.8, 
        height: size * 0.3,
        backgroundColor: color,
        opacity: 0.8,
        borderRadius: size * 0.05
      }]} />
      
      {/* Right face */}
      <View style={[styles.face, styles.right, { 
        width: size * 0.3, 
        height: size * 0.8,
        backgroundColor: color,
        opacity: 0.6,
        borderRadius: size * 0.05
      }]} />
      
      {/* Sparkle effect */}
      <View style={[styles.sparkle, { 
        width: size * 0.15, 
        height: size * 0.15,
        backgroundColor: 'white',
        borderRadius: size * 0.075,
        top: size * 0.2,
        left: size * 0.25
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
  face: {
    position: 'absolute',
  },
  front: {
    zIndex: 3,
  },
  top: {
    zIndex: 2,
    top: -4,
    transform: [{ skewX: '45deg' }],
  },
  right: {
    zIndex: 1,
    right: -4,
    transform: [{ skewY: '45deg' }],
  },
  sparkle: {
    position: 'absolute',
    zIndex: 4,
  }
});