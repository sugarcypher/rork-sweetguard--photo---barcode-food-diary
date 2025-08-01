import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { DAILY_SUGAR_LIMIT_GRAMS } from '@/constants/sugarLimits';
import { getSugarSeverity } from '@/constants/sugarLimits';

interface SugarProgressBarProps {
  currentSugar: number;
  limit?: number;
  showLabel?: boolean;
  height?: number;
}

export default function SugarProgressBar({ 
  currentSugar, 
  limit = DAILY_SUGAR_LIMIT_GRAMS,
  showLabel = true,
  height = 12
}: SugarProgressBarProps) {
  const progress = Math.min(currentSugar / limit, 1);
  const severity = getSugarSeverity(currentSugar);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false
    }).start();
  }, [progress]);
  
  const animatedScale = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };
  
  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{currentSugar}g</Text>
          <Text style={styles.limitLabel}>of {limit}g daily limit</Text>
          <Text style={[styles.severityLabel, { color: severity.color }]}>
            {severity.label}
          </Text>
        </View>
      )}
      
      <View 
        style={[styles.progressBackground, { height: height + 4 }]}
        onLayout={handleLayout}
      >
        <Animated.View 
          style={[
            styles.progressFill, 
            { 
              height: height + 4,
              transform: [{ scaleX: animatedScale }]
            }
          ]} 
        >
          <LinearGradient
            colors={progress > 0.8 ? 
              [Colors.danger, Colors.dangerLight] : 
              progress > 0.6 ? 
              [Colors.warning, Colors.warningLight] : 
              [Colors.success, Colors.successLight]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  limitLabel: {
    fontSize: 14,
    color: Colors.subtext,
    fontWeight: '500',
  },
  severityLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBackground: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressFill: {
    width: '100%',
    borderRadius: 12,
    transformOrigin: 'left',
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
    borderRadius: 12,
  }
});