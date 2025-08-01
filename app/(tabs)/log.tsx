import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Camera, Image, Plus } from 'lucide-react-native';

export default function LogFoodScreen() {
  const router = useRouter();
  
  const handleTakePhoto = () => {
    console.log('Take photo pressed');
  };
  
  const handleScanBarcode = () => {
    console.log('Scan barcode pressed');
  };
  
  const handleManualEntry = () => {
    console.log('Manual entry pressed');
    router.push('/food/add');
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'SugarCypher Scanner' }} />
      
      <View style={styles.container}>
        <Text style={styles.title}>Ready to crack some codes?</Text>
        <Text style={styles.subtitle}>Choose your scanning method!</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleTakePhoto}
          >
            <Camera size={24} color="white" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleScanBarcode}
          >
            <Image size={24} color="white" />
            <Text style={styles.buttonText}>Scan Barcode</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleManualEntry}
          >
            <Plus size={24} color="white" />
            <Text style={styles.buttonText}>Add Manually</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.infoText}>
          SugarCypher will analyze your food and reveal hidden sugars.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
    gap: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});