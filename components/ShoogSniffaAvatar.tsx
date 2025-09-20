import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface ShoogSniffaAvatarProps {
  size?: number;
  animated?: boolean;
  mood?: 'normal' | 'alert' | 'happy' | 'concerned';
}

export default function ShoogSniffaAvatar({ 
  size = 80, 
  animated = false,
  mood = 'normal' 
}: ShoogSniffaAvatarProps) {
  
  return (
    <View 
      style={[
        styles.container,
        {
          width: size,
          height: size,
        }
      ]}
    >
      <Image
        source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/c6i7mg8mq8es5j8zp5e8u' }}
        style={[
          styles.logo,
          {
            width: size,
            height: size,
          }
        ]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});