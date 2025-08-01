import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Camera, Scan, Zap } from 'lucide-react-native';
import BarcodeScanner from '@/components/BarcodeScanner';
import colors from '@/constants/colors';
import { useNavigation } from 'expo-router';
import { useCypherStore } from '@/store/cypherStore';
import { useFoodLogStore } from '@/store/foodLogStore';

export default function ScannerScreen() {
  const [scannerVisible, setScannerVisible] = useState(false);
  const navigation = useNavigation();
  const { setCypherData } = useCypherStore();
  const { addFood } = useFoodLogStore();

  const handleScan = (barcode: string) => {
    console.log('Barcode scanned in ScannerScreen:', barcode);
    // Here you would typically process the barcode to get food information
    // For now, we'll simulate adding to food log or showing cypher
    Alert.alert(
      'Barcode Scanned',
      'Choose an action for this barcode:',
      [
        { text: 'Cancel', onPress: () => setScannerVisible(true) },
        { text: 'Add to Food Log', onPress: () => {
          // Simulate adding to food log
          addFood({ id: Date.now().toString(), name: 'Scanned Food Item', sugarContent: 10, timestamp: new Date().toISOString(), hiddenSugars: [] });
          navigation.navigate({ pathname: '(tabs)/log' });
        }},
        { text: 'View Cypher Only', onPress: () => {
          // Simulate setting cypher data
          setCypherData({ barcode, info: 'Cypher information for ' + barcode });
          navigation.navigate({ pathname: '(tabs)/log', params: { cypherOnly: true } });
        }}
      ]
    );
    setScannerVisible(false);
  };

  const handleCloseScanner = () => {
    setScannerVisible(false);
  };

  const handleStartScanning = () => {
    setScannerVisible(true);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Scanner', headerShown: true }} />
      
      {!scannerVisible ? (
        <View style={styles.welcomeContainer}>
          <View style={styles.iconContainer}>
            <Camera size={80} color={colors.light.tint} />
          </View>
          
          <Text style={styles.title}>Food Scanner</Text>
          <Text style={styles.subtitle}>
            Scan barcodes to instantly get nutritional information and sugar content analysis
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Scan size={24} color={colors.light.tint} />
              <Text style={styles.featureText}>Quick barcode scanning</Text>
            </View>
            <View style={styles.feature}>
              <Zap size={24} color={colors.light.tint} />
              <Text style={styles.featureText}>Instant sugar analysis</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={handleStartScanning}
            testID="start-scan-button"
          >
            <Camera size={24} color="white" />
            <Text style={styles.scanButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <BarcodeScanner 
          visible={scannerVisible} 
          onClose={handleCloseScanner} 
          onScan={handleScan} 
          testId="barcode-scanner"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.light.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.tabIconDefault,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresContainer: {
    marginBottom: 50,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 16,
    color: colors.light.text,
    marginLeft: 12,
  },
  scanButton: {
    backgroundColor: colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
});
