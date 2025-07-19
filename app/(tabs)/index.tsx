import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useFoodLogStore, initializeWithSampleData } from '@/store/foodLogStore';
import Colors from '@/constants/colors';
import SugarProgressBar from '@/components/SugarProgressBar';
import MealSection from '@/components/MealSection';
import EmptyState from '@/components/EmptyState';
import DateSelector from '@/components/DateSelector';
import HiddenSugarAlert from '@/components/HiddenSugarAlert';
import SugarThresholdAlert from '@/components/SugarThresholdAlert';
import AlternativeSuggestions from '@/components/AlternativeSuggestions';
import DailyReflection from '@/components/DailyReflection';
import MainMenu from '@/components/MainMenu';
import SugarCubeIcon from '@/components/SugarCubeIcon';
import { Food, ReflectionData } from '@/types/food';
import { formatDateToYYYYMMDD } from '@/utils/foodUtils';
import { Plus, MessageCircle, BookOpen } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [totalSugar, setTotalSugar] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [showMainMenu, setShowMainMenu] = useState(false);
  
  const { 
    todaysFoods, 
    todaysTotalSugar, 
    getLogForDate, 
    removeFood,
    saveReflection,
    isLoading
  } = useFoodLogStore();
  
  useEffect(() => {
    // Initialize with sample data for demo purposes
    initializeWithSampleData();
  }, []);
  
  useEffect(() => {
    if (isLoading) return;
    
    const isToday = 
      selectedDate.getDate() === new Date().getDate() &&
      selectedDate.getMonth() === new Date().getMonth() &&
      selectedDate.getFullYear() === new Date().getFullYear();
    
    if (isToday) {
      setFoods(todaysFoods);
      setTotalSugar(todaysTotalSugar);
    } else {
      const dateString = formatDateToYYYYMMDD(selectedDate);
      const log = getLogForDate(dateString);
      
      if (log) {
        setFoods(log.foods);
        setTotalSugar(log.totalSugar);
      } else {
        setFoods([]);
        setTotalSugar(0);
      }
    }
  }, [selectedDate, todaysFoods, todaysTotalSugar, getLogForDate, isLoading]);
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setDismissedAlerts([]); // Reset dismissed alerts for new date
  };
  
  const handleFoodPress = (food: Food) => {
    // Navigate to food details screen
    router.push({
      pathname: '/food/[id]',
      params: { id: food.id }
    });
  };
  
  const handleFoodDelete = (foodId: string) => {
    removeFood(foodId);
  };
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };
  
  const getAllHiddenSugars = () => {
    const allHiddenSugars = foods.flatMap(food => food.hiddenSugarTypes || []);
    // Remove duplicates based on name
    return allHiddenSugars.filter((sugar, index, self) => 
      index === self.findIndex(s => s.name === sugar.name)
    );
  };
  
  const getHighSugarFood = () => {
    return foods.find(food => food.sugarPerServing > 15);
  };
  
  const handleSaveReflection = (reflection: ReflectionData) => {
    saveReflection(reflection);
  };
  
  const dismissAlert = (alertType: string) => {
    setDismissedAlerts(prev => [...prev, alertType]);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Sugar Tracker',
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowMainMenu(!showMainMenu)}
            >
              <SugarCubeIcon size={28} color={showMainMenu ? Colors.accent : Colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              {isToday() && !showMainMenu && (
                <>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => setShowReflection(true)}
                  >
                    <MessageCircle size={22} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => router.push('/log')}
                  >
                    <Plus size={24} color={Colors.primary} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )
        }} 
      />
      
      <View style={styles.container}>
        {/* Main Menu Overlay */}
        <MainMenu 
          visible={showMainMenu}
          onClose={() => setShowMainMenu(false)}
          onReflectionPress={() => {
            setShowMainMenu(false);
            setShowReflection(true);
          }}
        />
        
        {/* Main Content */}
        {!showMainMenu && (
          <>
            <DateSelector 
              currentDate={selectedDate}
              onDateChange={handleDateChange}
            />
            
            <View style={styles.progressContainer}>
              <SugarProgressBar currentSugar={totalSugar} />
            </View>
            
            {/* Alerts Section */}
            {isToday() && !dismissedAlerts.includes('threshold') && (
              <SugarThresholdAlert 
                currentSugar={totalSugar}
                onDismiss={() => dismissAlert('threshold')}
              />
            )}
            
            {getAllHiddenSugars().length > 0 && !dismissedAlerts.includes('hidden-sugars') && (
              <HiddenSugarAlert 
                hiddenSugars={getAllHiddenSugars()}
                onDismiss={() => dismissAlert('hidden-sugars')}
                showDetails={true}
              />
            )}
            
            {getHighSugarFood() && !dismissedAlerts.includes('alternatives') && (
              <AlternativeSuggestions
                foodName={getHighSugarFood()!.name}
                currentSugar={getHighSugarFood()!.sugarPerServing}
              />
            )}
            
            {foods.length > 0 ? (
              <ScrollView 
                style={styles.scrollView}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              >
                <MealSection 
                  title="Breakfast" 
                  foods={foods} 
                  mealType="breakfast"
                  onFoodPress={handleFoodPress}
                  onFoodDelete={handleFoodDelete}
                />
                
                <MealSection 
                  title="Lunch" 
                  foods={foods} 
                  mealType="lunch"
                  onFoodPress={handleFoodPress}
                  onFoodDelete={handleFoodDelete}
                />
                
                <MealSection 
                  title="Dinner" 
                  foods={foods} 
                  mealType="dinner"
                  onFoodPress={handleFoodPress}
                  onFoodDelete={handleFoodDelete}
                />
                
                <MealSection 
                  title="Snacks" 
                  foods={foods} 
                  mealType="snack"
                  onFoodPress={handleFoodPress}
                  onFoodDelete={handleFoodDelete}
                />
                
                <View style={styles.footer} />
              </ScrollView>
            ) : (
              <EmptyState 
                title="No foods logged yet"
                message={isToday() ? 
                  "Tap the sugar cube icon to access the main menu and start tracking your sugar intake" : 
                  "No foods were logged on this day"
                }
              />
            )}
          </>
        )}
        
        {/* Food Diary Button at Bottom */}
        {!showMainMenu && (
          <View style={styles.bottomBar}>
            <TouchableOpacity 
              style={styles.diaryButton}
              onPress={() => {/* Already on diary page */}}
              activeOpacity={0.8}
            >
              <BookOpen size={20} color="white" />
              <Text style={styles.diaryButtonText}>Food Diary</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <DailyReflection
        visible={showReflection}
        onClose={() => setShowReflection(false)}
        onSave={handleSaveReflection}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressContainer: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  footer: {
    height: 80, // Extra space for bottom bar
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  diaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.sugar,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  diaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  }
});