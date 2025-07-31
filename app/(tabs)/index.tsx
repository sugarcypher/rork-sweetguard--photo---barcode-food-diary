import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Plus, MessageCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  

  

  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  

  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Sugar Tracker',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/log')}
              >
                <Plus size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome to SugarCypher</Text>
            <Text style={styles.welcomeSubtitle}>Track your sugar intake and stay healthy</Text>
          </View>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/log')}
            >
              <Plus size={24} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Log Food</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/scanner')}
            >
              <MessageCircle size={24} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Scan Food</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  actionButton: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  footer: {
    height: 80,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
});