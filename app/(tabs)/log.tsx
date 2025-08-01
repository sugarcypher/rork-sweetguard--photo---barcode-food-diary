import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Camera, QrCode, Plus, Sparkles, Zap } from 'lucide-react-native';
import PremiumButton from '@/components/PremiumButton';

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
      <Stack.Screen options={{ 
        title: 'Food Logger',
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '800',
        }
      }} />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroIcon}>
            <Sparkles size={32} color="white" />
          </View>
          <Text style={styles.heroTitle}>Ready to Decode?</Text>
          <Text style={styles.heroSubtitle}>Choose your preferred method to log food</Text>
        </LinearGradient>
        
        {/* Action Cards */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionCard}>
            <LinearGradient
              colors={[Colors.cardElevated, Colors.surface]}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={Colors.gradientPrimary}
                  style={styles.cardIcon}
                >
                  <Camera size={24} color="white" />
                </LinearGradient>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Photo Scan</Text>
                  <Text style={styles.cardDescription}>Snap a photo of your food</Text>
                </View>
              </View>
              <PremiumButton
                title="Take Photo"
                onPress={handleTakePhoto}
                variant="primary"
                size="medium"
                icon={<Camera size={18} color="white" />}
              />
            </LinearGradient>
          </View>
          
          <View style={styles.actionCard}>
            <LinearGradient
              colors={[Colors.cardElevated, Colors.surface]}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={Colors.gradientSecondary}
                  style={styles.cardIcon}
                >
                  <QrCode size={24} color="white" />
                </LinearGradient>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Barcode Scan</Text>
                  <Text style={styles.cardDescription}>Scan product barcode</Text>
                </View>
              </View>
              <PremiumButton
                title="Scan Barcode"
                onPress={handleScanBarcode}
                variant="secondary"
                size="medium"
                icon={<QrCode size={18} color="white" />}
              />
            </LinearGradient>
          </View>
          
          <View style={styles.actionCard}>
            <LinearGradient
              colors={[Colors.cardElevated, Colors.surface]}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={Colors.gradientSuccess}
                  style={styles.cardIcon}
                >
                  <Plus size={24} color="white" />
                </LinearGradient>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Manual Entry</Text>
                  <Text style={styles.cardDescription}>Add food details manually</Text>
                </View>
              </View>
              <PremiumButton
                title="Add Manually"
                onPress={handleManualEntry}
                variant="success"
                size="medium"
                icon={<Plus size={18} color="white" />}
              />
            </LinearGradient>
          </View>
        </View>
        
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <LinearGradient
              colors={[Colors.warning + '20', Colors.warning + '10']}
              style={styles.infoGradient}
            >
              <Zap size={20} color={Colors.warning} />
              <Text style={styles.infoText}>
                SugarCypher will analyze your food and reveal hidden sugars using advanced AI detection.
              </Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Hero Section
  heroSection: {
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Actions Container
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  actionCard: {
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.subtext,
    fontWeight: '500',
  },
  
  // Info Section
  infoSection: {
    padding: 20,
    paddingTop: 32,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
});