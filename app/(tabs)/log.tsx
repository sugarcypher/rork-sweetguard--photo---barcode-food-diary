import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { DesignSystem, PremiumColors } from '@/constants/designSystem';
import { Camera, QrCode, Plus, Sparkles, Zap, ArrowRight } from 'lucide-react-native';
import PremiumButton from '@/components/PremiumButton';
import EnterpriseCard from '@/components/ui/EnterpriseCard';
import EnterpriseButton from '@/components/ui/EnterpriseButton';
import EnterpriseHeader from '@/components/ui/EnterpriseHeader';

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
      <StatusBar barStyle="light-content" backgroundColor={PremiumColors.background.primary} />
      <Stack.Screen options={{ 
        title: 'Food Logger',
        headerStyle: {
          backgroundColor: PremiumColors.background.primary,
        },
        headerTitleStyle: {
          ...DesignSystem.typography.h3,
          color: PremiumColors.text.primary,
        },
        headerTintColor: PremiumColors.text.primary,
      }} />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Enterprise Hero Header */}
        <EnterpriseHeader
          title="Ready to Decode?"
          subtitle="Choose your preferred method to log food"
          icon={<Sparkles size={28} color="white" />}
          variant="gradient"
        />
        
        {/* Enterprise Action Cards */}
        <View style={styles.actionsContainer}>
          <EnterpriseCard variant="elevated" shadow="lg" style={styles.actionCard}>
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={Colors.gradientPrimary}
                style={styles.cardIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Camera size={28} color="white" />
              </LinearGradient>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Photo Scan</Text>
                <Text style={styles.cardDescription}>Snap a photo of your food for instant analysis</Text>
                <View style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>AI POWERED</Text>
                </View>
              </View>
            </View>
            <EnterpriseButton
              title="Take Photo"
              onPress={handleTakePhoto}
              variant="primary"
              size="md"
              icon={<Camera size={18} color="white" />}
              iconPosition="left"
              fullWidth
            />
          </EnterpriseCard>
          
          <EnterpriseCard variant="elevated" shadow="lg" style={styles.actionCard}>
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={Colors.gradientSecondary}
                style={styles.cardIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <QrCode size={28} color="white" />
              </LinearGradient>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Barcode Scan</Text>
                <Text style={styles.cardDescription}>Scan product barcode for detailed nutrition info</Text>
                <View style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>INSTANT</Text>
                </View>
              </View>
            </View>
            <EnterpriseButton
              title="Scan Barcode"
              onPress={handleScanBarcode}
              variant="secondary"
              size="md"
              icon={<QrCode size={18} color="white" />}
              iconPosition="left"
              fullWidth
            />
          </EnterpriseCard>
          
          <EnterpriseCard variant="elevated" shadow="lg" style={styles.actionCard}>
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={Colors.gradientSuccess}
                style={styles.cardIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Plus size={28} color="white" />
              </LinearGradient>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Manual Entry</Text>
                <Text style={styles.cardDescription}>Add food details manually with precision</Text>
                <View style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>PRECISE</Text>
                </View>
              </View>
            </View>
            <EnterpriseButton
              title="Add Manually"
              onPress={handleManualEntry}
              variant="success"
              size="md"
              icon={<Plus size={18} color="white" />}
              iconPosition="left"
              fullWidth
            />
          </EnterpriseCard>
        </View>
        
        {/* Enterprise Info Section */}
        <View style={styles.infoSection}>
          <EnterpriseCard 
            variant="glass" 
            shadow="md"
            gradientColors={[
              PremiumColors.semantic.info + '20', 
              PremiumColors.semantic.info + '10'
            ] as const}
          >
            <View style={styles.infoContent}>
              <View style={styles.infoIconContainer}>
                <Zap size={24} color={PremiumColors.semantic.info} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>AI-Powered Analysis</Text>
                <Text style={styles.infoText}>
                  SugarCypher uses advanced machine learning to analyze your food and reveal hidden sugars with enterprise-grade accuracy.
                </Text>
                <View style={styles.infoFeatures}>
                  <View style={styles.infoFeature}>
                    <ArrowRight size={12} color={PremiumColors.semantic.success} />
                    <Text style={styles.infoFeatureText}>99.7% Accuracy</Text>
                  </View>
                  <View style={styles.infoFeature}>
                    <ArrowRight size={12} color={PremiumColors.semantic.success} />
                    <Text style={styles.infoFeatureText}>Real-time Processing</Text>
                  </View>
                  <View style={styles.infoFeature}>
                    <ArrowRight size={12} color={PremiumColors.semantic.success} />
                    <Text style={styles.infoFeatureText}>Comprehensive Database</Text>
                  </View>
                </View>
              </View>
            </View>
          </EnterpriseCard>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PremiumColors.background.primary,
  },
  
  // Actions Container
  actionsContainer: {
    paddingHorizontal: DesignSystem.spacing.lg,
    gap: DesignSystem.spacing.lg,
  },
  actionCard: {
    marginBottom: DesignSystem.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: DesignSystem.spacing.lg,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignSystem.spacing.md,
    ...DesignSystem.shadows.md,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    ...DesignSystem.typography.h4,
    color: PremiumColors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  cardDescription: {
    ...DesignSystem.typography.body2,
    color: PremiumColors.text.tertiary,
    marginBottom: DesignSystem.spacing.sm,
    lineHeight: 20,
  },
  featureBadge: {
    backgroundColor: PremiumColors.brand.primary + '20',
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: 2,
    borderRadius: DesignSystem.borderRadius.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: PremiumColors.brand.primary + '40',
  },
  featureBadgeText: {
    ...DesignSystem.typography.overline,
    color: PremiumColors.brand.primary,
    fontSize: 9,
  },
  
  // Info Section
  infoSection: {
    padding: DesignSystem.spacing.lg,
    paddingTop: DesignSystem.spacing.xl,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PremiumColors.semantic.info + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignSystem.spacing.md,
    borderWidth: 1,
    borderColor: PremiumColors.semantic.info + '40',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    ...DesignSystem.typography.h4,
    color: PremiumColors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  infoText: {
    ...DesignSystem.typography.body2,
    color: PremiumColors.text.secondary,
    lineHeight: 22,
    marginBottom: DesignSystem.spacing.md,
  },
  infoFeatures: {
    gap: DesignSystem.spacing.xs,
  },
  infoFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  infoFeatureText: {
    ...DesignSystem.typography.caption,
    color: PremiumColors.text.tertiary,
    fontWeight: '600',
  },
});