import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
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
        </View>
      )}
      
      <View 
        style={[styles.progressBackground, { height }]}
        onLayout={handleLayout}
      >
        <Animated.View 
          style={[
            styles.progressFill, 
            { 
              backgroundColor: severity.color,
              height,
              transform: [{ scaleX: animatedScale }]
            }
          ]} 
        />
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
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  limitLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  progressBackground: {
    width: '100%',
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    borderRadius: 6,
    transformOrigin: 'left',
    position: 'absolute',
    left: 0,
    top: 0,
  }
});