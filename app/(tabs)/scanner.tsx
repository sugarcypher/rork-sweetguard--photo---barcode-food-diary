import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Camera, Scan, AlertTriangle, Brain, Sparkles } from 'lucide-react-native';
import IntelligentScanner from '@/components/IntelligentScanner';
import colors from '@/constants/colors';
import { router } from 'expo-router';
import { useFoodLogStore } from '@/store/foodLogStore';
import { Food } from '@/types/food';

export default function ScannerScreen() {
  const [scannerVisible, setScannerVisible] = useState(false);

  const { addFood } = useFoodLogStore();

  const handleFoodScanned = (food: Food) => {
    console.log('Food scanned:', food);
    
    // Show success alert
    Alert.alert(
      'Food Added Successfully!',
      `${food.name} has been added to your log with ${food.sugarPerServing}g sugar per serving.`,
      [
        { text: 'View Log', onPress: () => router.push('/(tabs)/log') },
        { text: 'Scan Another', onPress: () => setScannerVisible(true) },
        { text: 'OK', style: 'default' }
      ]
    );
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
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Camera size={48} color={colors.primary} />
            </View>
          </View>
          
          <Text style={styles.title}>Intelligent Food Scanner</Text>
          <Text style={styles.subtitle}>
            AI-powered scanner that automatically detects barcodes, food labels, receipts, and ingredient lists
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Brain size={20} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI Content Detection</Text>
                <Text style={styles.featureDescription}>Automatically identifies what you're scanning</Text>
              </View>
            </View>
            
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Scan size={20} color={colors.accent} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Multi-Format Support</Text>
                <Text style={styles.featureDescription}>Barcodes, labels, receipts, ingredients</Text>
              </View>
            </View>
            
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Sparkles size={20} color={colors.warning} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Multiple Photos</Text>
                <Text style={styles.featureDescription}>Capture different sides of packaging</Text>
              </View>
            </View>
            
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <AlertTriangle size={20} color={colors.error} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Hidden Sugar Detection</Text>
                <Text style={styles.featureDescription}>Identify disguised sweeteners</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={handleStartScanning}
            testID="start-scan-button"
          >
            <View style={styles.scanButtonContent}>
              <Camera size={24} color="#000" />
              <Text style={styles.scanButtonText}>Start Intelligent Scan</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>AI-Powered Food Analysis</Text>
            <Text style={styles.infoText}>
              Our intelligent scanner uses advanced AI to automatically detect and process any food-related content. Simply point and shoot - the AI will determine what you're scanning and extract all relevant nutritional information.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <IntelligentScanner 
        visible={scannerVisible} 
        onClose={handleCloseScanner} 
        onFoodScanned={handleFoodScanned}
        testId="intelligent-scanner"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    minHeight: '100%',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    marginBottom: 48,
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginBottom: 32,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  scanButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700' as const,
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
