import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function TabsIndex() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to log tab as default
    router.replace('/(tabs)/log');
  }, [router]);
  
  return null;
}