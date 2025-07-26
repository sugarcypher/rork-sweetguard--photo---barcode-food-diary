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
      {/* Outer protective ring with shield */}
      <View style={[styles.outerRing, { 
        width: size, 
        height: size,
        borderColor: '#14B8A6',
        borderRadius: size / 2
      }]} >
        {/* Shield in outer ring */}
        <View style={[styles.outerShield, {
          top: size * 0.05,
          right: size * 0.05
        }]}>
          <Shield 
            size={size * 0.15} 
            color={'#14B8A6'} 
            fill={'rgba(20, 184, 166, 0.3)'}
          />
        </View>
      </View>
      
      {/* Center sugar pile background */}
      <View style={[styles.sugarPileBg, { 
        width: size * 0.7, 
        height: size * 0.7,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: size * 0.35
      }]} />
      
      {/* Sugar pile (multiple small cubes) */}
      <View style={styles.sugarPileContainer}>
        {/* Bottom layer sugar cubes */}
        <View style={[styles.sugarCube, {
          width: size * 0.12,
          height: size * 0.12,
          backgroundColor: '#FFFFFF',
          bottom: size * 0.05,
          left: size * 0.02
        }]} />
        <View style={[styles.sugarCube, {
          width: size * 0.1,
          height: size * 0.1,
          backgroundColor: '#F8F8FF',
          bottom: size * 0.08,
          right: size * 0.05
        }]} />
        <View style={[styles.sugarCube, {
          width: size * 0.08,
          height: size * 0.08,
          backgroundColor: '#FFFAFA',
          bottom: size * 0.12,
          left: size * 0.08
        }]} />
        
        {/* Main center sugar cube */}
        <View style={[styles.mainSugarCube, {
          width: size * 0.18,
          height: size * 0.18,
          backgroundColor: '#FFFFFF'
        }]} />
        
        {/* Top layer sugar cubes */}
        <View style={[styles.sugarCube, {
          width: size * 0.09,
          height: size * 0.09,
          backgroundColor: '#F0F8FF',
          top: size * 0.08,
          right: size * 0.02
        }]} />
        <View style={[styles.sugarCube, {
          width: size * 0.07,
          height: size * 0.07,
          backgroundColor: '#FFFFF0',
          top: size * 0.05,
          left: size * 0.12
        }]} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerShield: {
    position: 'absolute',
    zIndex: 2,
  },
  sugarPileBg: {
    position: 'absolute',
    zIndex: 2,
  },
  sugarPileContainer: {
    position: 'absolute',
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sugarCube: {
    position: 'absolute',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mainSugarCube: {
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
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