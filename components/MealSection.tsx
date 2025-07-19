import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Food, MealType } from '@/types/food';
import Colors from '@/constants/colors';
import FoodCard from './FoodCard';

interface MealSectionProps {
  title: string;
  foods: Food[];
  mealType: MealType;
  onFoodPress: (food: Food) => void;
  onFoodDelete: (foodId: string) => void;
}

export default function MealSection({ 
  title, 
  foods, 
  mealType, 
  onFoodPress, 
  onFoodDelete 
}: MealSectionProps) {
  const mealFoods = foods.filter(food => food.mealType === mealType);
  
  if (mealFoods.length === 0) {
    return null;
  }
  
  const totalSugar = mealFoods.reduce((sum, food) => sum + food.sugarPerServing, 0);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sugarTotal}>{totalSugar}g sugar</Text>
      </View>
      
      {mealFoods.map(food => (
        <FoodCard 
          key={food.id} 
          food={food} 
          onPress={() => onFoodPress(food)}
          onDelete={() => onFoodDelete(food.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  sugarTotal: {
    fontSize: 14,
    color: Colors.sugar,
    fontWeight: '500',
  }
});