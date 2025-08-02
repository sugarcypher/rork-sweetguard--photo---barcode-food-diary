import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { DesignSystem, PremiumColors } from '@/constants/designSystem';
import { Camera, QrCode, Plus, Calendar, TrendingUp } from 'lucide-react-native';
import EnterpriseCard from '@/components/ui/EnterpriseCard';
import EnterpriseButton from '@/components/ui/EnterpriseButton';
import EnterpriseHeader from '@/components/ui/EnterpriseHeader';
import { useFoodLogStore } from '@/store/foodLogStore';
import FoodCard from '@/components/FoodCard';
import MealSection from '@/components/MealSection';
import DateSelector from '@/components/DateSelector';
import SugarProgressBar from '@/components/SugarProgressBar';
import EmptyState from '@/components/EmptyState';
import { Food, MealType } from '@/types/food';

export default function LogFoodScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const { 
    todaysFoods, 
    todaysTotalSugar, 
    getLogForDate, 
    removeFood, 
    calculateInsights,
    getSugarProgress
  } = useFoodLogStore();
  
  const dateString = selectedDate.toISOString().split('T')[0];
  const isToday = dateString === new Date().toISOString().split('T')[0];
  const currentLog = isToday ? { foods: todaysFoods, totalSugar: todaysTotalSugar } : getLogForDate(dateString);
  const foods = currentLog?.foods || [];
  const totalSugar = currentLog?.totalSugar || 0;
  
  const handleTakePhoto = () => {
    console.log('Take photo pressed');
    router.push('/scanner');
  };
  
  const handleScanBarcode = () => {
    console.log('Scan barcode pressed');
    router.push('/scanner');
  };
  
  const handleManualEntry = () => {
    console.log('Manual entry pressed');
    router.push('/food/add');
  };
  
  const handleFoodPress = (food: Food) => {
    router.push(`/food/${food.id}`);
  };
  
  const handleFoodDelete = (foodId: string) => {
    if (isToday) {
      removeFood(foodId);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    calculateInsights();
    setTimeout(() => setRefreshing(false), 1000);
  };
  
  const getMealFoods = (mealType: MealType) => {
    return foods.filter(food => food.mealType === mealType);
  };
  
  const sugarProgress = getSugarProgress();
  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={PremiumColors.background.primary} />
      <Stack.Screen options={{ 
        title: 'Food Log',
        headerStyle: {
          backgroundColor: PremiumColors.background.primary,
        },
        headerTitleStyle: {
          ...DesignSystem.typography.h3,
          color: PremiumColors.text.primary,
        },
        headerTintColor: PremiumColors.text.primary,
      }} />
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PremiumColors.brand.primary}
            colors={[PremiumColors.brand.primary]}
          />
        }
      >
        {/* Date Selector */}
        <View style={styles.dateSection}>
          <EnterpriseCard variant="elevated" shadow="sm">
            <DateSelector 
              currentDate={selectedDate} 
              onDateChange={setSelectedDate} 
            />
          </EnterpriseCard>
        </View>
        
        {/* Sugar Progress */}
        {foods.length > 0 && (
          <View style={styles.progressSection}>
            <EnterpriseCard variant="elevated" shadow="md">
              <View style={styles.progressHeader}>
                <View style={styles.progressTitleContainer}>
                  <TrendingUp size={20} color={PremiumColors.brand.primary} />
                  <Text style={styles.progressTitle}>Daily Sugar Intake</Text>
                </View>
                <Text style={styles.progressValue}>{totalSugar.toFixed(1)}g</Text>
              </View>
              <SugarProgressBar 
                currentSugar={totalSugar} 
                showLabel={false}
                height={16}
              />
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatLabel}>Foods Logged</Text>
                  <Text style={styles.progressStatValue}>{foods.length}</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatLabel}>Progress</Text>
                  <Text style={styles.progressStatValue}>{Math.round(sugarProgress * 100)}%</Text>
                </View>
              </View>
            </EnterpriseCard>
          </View>
        )}
        
        {/* Food Log Content */}
        {foods.length > 0 ? (
          <View style={styles.logContent}>
            {/* Breakfast */}
            {getMealFoods('breakfast').length > 0 && (
              <MealSection
                title="Breakfast"
                foods={foods}
                mealType="breakfast"
                onFoodPress={handleFoodPress}
                onFoodDelete={handleFoodDelete}
              />
            )}
            
            {/* Lunch */}
            {getMealFoods('lunch').length > 0 && (
              <MealSection
                title="Lunch"
                foods={foods}
                mealType="lunch"
                onFoodPress={handleFoodPress}
                onFoodDelete={handleFoodDelete}
              />
            )}
            
            {/* Dinner */}
            {getMealFoods('dinner').length > 0 && (
              <MealSection
                title="Dinner"
                foods={foods}
                mealType="dinner"
                onFoodPress={handleFoodPress}
                onFoodDelete={handleFoodDelete}
              />
            )}
            
            {/* Snacks */}
            {getMealFoods('snack').length > 0 && (
              <MealSection
                title="Snacks"
                foods={foods}
                mealType="snack"
                onFoodPress={handleFoodPress}
                onFoodDelete={handleFoodDelete}
              />
            )}
            
            {/* Other/Uncategorized */}
            {foods.filter(food => !food.mealType || !['breakfast', 'lunch', 'dinner', 'snack'].includes(food.mealType)).length > 0 && (
              <View style={styles.mealSection}>
                <Text style={styles.mealTitle}>Other</Text>
                {foods
                  .filter(food => !food.mealType || !['breakfast', 'lunch', 'dinner', 'snack'].includes(food.mealType))
                  .map(food => (
                    <FoodCard 
                      key={food.id} 
                      food={food} 
                      onPress={() => handleFoodPress(food)}
                      onDelete={isToday ? () => handleFoodDelete(food.id) : undefined}
                    />
                  ))
                }
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <EmptyState
              title={isToday ? "No foods logged today" : "No foods logged"}
              message={isToday ? "Start by adding your first meal or snack" : "No food entries found for this date"}
              icon={<Calendar size={60} color={PremiumColors.text.tertiary} />}
            />
          </View>
        )}
        
        {/* Quick Actions - Only show for today */}
        {isToday && (
          <View style={styles.quickActionsSection}>
            <EnterpriseHeader
              title="Quick Add"
              subtitle="Choose your preferred method to log food"
              icon={<Plus size={24} color="#FFFFFF" />}
              variant="gradient"
            />
            
            <View style={styles.quickActions}>
              <EnterpriseButton
                title="Photo Scan"
                onPress={handleTakePhoto}
                variant="primary"
                size="md"
                icon={<Camera size={18} color="#FFFFFF" />}
                iconPosition="left"
                style={styles.quickActionButton}
                textStyle={styles.quickActionText}
              />
              <EnterpriseButton
                title="Barcode"
                onPress={handleScanBarcode}
                variant="secondary"
                size="md"
                icon={<QrCode size={18} color="#FFFFFF" />}
                iconPosition="left"
                style={styles.quickActionButton}
                textStyle={styles.quickActionText}
              />
              <EnterpriseButton
                title="Manual"
                onPress={handleManualEntry}
                variant="success"
                size="md"
                icon={<Plus size={18} color="#FFFFFF" />}
                iconPosition="left"
                style={styles.quickActionButton}
                textStyle={styles.quickActionText}
              />
            </View>
          </View>
        )}
        
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PremiumColors.background.primary,
  },
  
  // Date Section
  dateSection: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingTop: DesignSystem.spacing.md,
    paddingBottom: DesignSystem.spacing.sm,
  },
  
  // Progress Section
  progressSection: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  progressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  progressTitle: {
    ...DesignSystem.typography.h4,
    color: PremiumColors.text.primary,
  },
  progressValue: {
    ...DesignSystem.typography.h3,
    color: PremiumColors.brand.primary,
    fontWeight: '700',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: DesignSystem.spacing.md,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatLabel: {
    ...DesignSystem.typography.caption,
    color: PremiumColors.text.tertiary,
    marginBottom: 2,
  },
  progressStatValue: {
    ...DesignSystem.typography.h4,
    color: PremiumColors.text.primary,
    fontWeight: '600',
  },
  
  // Log Content
  logContent: {
    paddingHorizontal: DesignSystem.spacing.lg,
  },
  mealSection: {
    marginBottom: DesignSystem.spacing.xl,
  },
  mealTitle: {
    ...DesignSystem.typography.h3,
    color: PremiumColors.text.primary,
    marginBottom: DesignSystem.spacing.md,
    fontWeight: '600',
  },
  
  // Empty State
  emptyStateContainer: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.xl * 2,
  },
  
  // Quick Actions
  quickActionsSection: {
    paddingTop: DesignSystem.spacing.xl,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: DesignSystem.spacing.lg,
    gap: DesignSystem.spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    minHeight: 48,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Bottom Spacing
  bottomSpacing: {
    height: DesignSystem.spacing.xl * 2,
  },
});