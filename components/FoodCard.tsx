import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Food } from '@/types/food';
import Colors from '@/constants/colors';
import { getSugarSeverity } from '@/constants/sugarLimits';
import { AlertTriangle, Clock, Trash2, Zap } from 'lucide-react-native';

interface FoodCardProps {
  food: Food;
  onPress?: () => void;
  onDelete?: () => void;
  showTime?: boolean;
}

export default function FoodCard({ food, onPress, onDelete, showTime = true }: FoodCardProps) {
  const severity = getSugarSeverity(food.sugarPerServing);
  const totalSugarImpact = food.sugarPerServing + (food.sugarEquivalent || 0);
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getHighestRiskHiddenSugar = () => {
    if (!food.hiddenSugarTypes || food.hiddenSugarTypes.length === 0) return null;
    
    const highRisk = food.hiddenSugarTypes.find(sugar => sugar.severity === 'high');
    if (highRisk) return highRisk;
    
    const mediumRisk = food.hiddenSugarTypes.find(sugar => sugar.severity === 'medium');
    return mediumRisk || food.hiddenSugarTypes[0];
  };
  
  const highestRiskSugar = getHighestRiskHiddenSugar();
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {food.imageUri ? (
            <Image source={{ uri: food.imageUri }} style={styles.image} />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: Colors.border }]} />
          )}
        </View>
        
        <View style={styles.details}>
          <Text style={styles.name}>{food.name}</Text>
          {food.brand && <Text style={styles.brand}>{food.brand}</Text>}
          
          <View style={styles.nutritionRow}>
            <View style={styles.sugarBadge}>
              <Text style={styles.sugarText}>
                {totalSugarImpact.toFixed(1)}g sugar
                {food.sugarEquivalent && food.sugarEquivalent > 0 && '*'}
              </Text>
            </View>
            
            {food.calories && (
              <Text style={styles.calories}>{food.calories} cal</Text>
            )}
          </View>
          
          {food.sugarEquivalent && food.sugarEquivalent > 0 && (
            <View style={styles.equivalentRow}>
              <Zap size={12} color={Colors.warning} />
              <Text style={styles.equivalentText}>
                +{food.sugarEquivalent}g sugar equivalent
              </Text>
            </View>
          )}
          
          {highestRiskSugar && (
            <View style={styles.warningRow}>
              <AlertTriangle size={14} color={Colors.danger} />
              <Text style={styles.warningText}>
                Contains {highestRiskSugar.name} ({highestRiskSugar.severity} risk)
              </Text>
            </View>
          )}
          
          {showTime && (
            <View style={styles.timeRow}>
              <Clock size={12} color={Colors.subtext} />
              <Text style={styles.timeText}>{formatTime(food.timestamp)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.rightContent}>
          <View style={[styles.severityIndicator, { backgroundColor: severity.color }]} />
          
          {onDelete && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={onDelete}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Trash2 size={18} color={Colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  brand: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  sugarBadge: {
    backgroundColor: Colors.sugar,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  sugarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  calories: {
    fontSize: 12,
    color: Colors.subtext,
  },
  equivalentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  equivalentText: {
    fontSize: 11,
    color: Colors.warning,
    marginLeft: 4,
    fontWeight: '500',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  warningText: {
    fontSize: 11,
    color: Colors.danger,
    marginLeft: 4,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  timeText: {
    fontSize: 12,
    color: Colors.subtext,
    marginLeft: 4,
  },
  rightContent: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  severityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  deleteButton: {
    padding: 4,
  }
});