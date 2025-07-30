import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import BarcodeScanner from '@/components/BarcodeScanner';
import colors from '@/constants/colors';
import { useNavigation } from 'expo-router';
import { useCypherStore } from '@/store/cypherStore';
import { useFoodLogStore } from '@/store/foodLogStore';

export default function ScannerScreen() {
  const [scannerVisible, setScannerVisible] = useState(true);
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
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Scanner', headerShown: false }} />
      <BarcodeScanner 
        visible={scannerVisible} 
        onClose={handleCloseScanner} 
        onScan={handleScan} 
        testId="barcode-scanner"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
