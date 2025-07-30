import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trophy, Star, Zap } from 'lucide-react-native';
import { useGamification } from '@/store/gamificationStore';
import colors from '@/constants/colors';
import { LEVEL_THRESHOLDS } from '@/constants/gamification';

interface GamificationHeaderProps {
  onPress?: () => void;
}

export default function GamificationHeader({ onPress }: GamificationHeaderProps) {
  const { userStats, getPointsToNextLevel } = useGamification();
  const pointsToNext = getPointsToNextLevel();
  const currentLevelPoints = userStats.level > 1 ? LEVEL_THRESHOLDS[userStats.level - 1] : 0;
  const nextLevelPoints = userStats.level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[userStats.level] : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progress = userStats.level < LEVEL_THRESHOLDS.length ? 
    (userStats.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints) : 1;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.leftSection}>
        <View style={styles.levelBadge}>
          <Star size={16} color={colors.warning} fill={colors.warning} />
          <Text style={styles.levelText}>{userStats.level}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {userStats.totalPoints} XP {pointsToNext > 0 && `• ${pointsToNext} to next level`}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.statItem}>
          <Zap size={16} color={colors.warning} />
          <Text style={styles.statText}>{userStats.streak}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Trophy size={16} color={colors.accent} />
          <Text style={styles.statText}>{userStats.badges.length}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
    marginLeft: 4,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
});