import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { trpc, trpcClient } from "@/lib/trpc";
import { useSecurityStore } from "@/store/securityStore";
import { SecurityAlertBanner } from "@/components/SecurityAlert";
import { EvidenceCollector } from "@/components/EvidenceCollector";
import { ShoppingStoreProvider } from "@/store/shoppingStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/meet-sniffa" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/features" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/permissions" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize security system
        const { initializeSecurity } = useSecurityStore.getState();
        await initializeSecurity();
        
        // Initialize launch evidence collection for SOC 2 compliance
        try {
          await trpcClient.security.evidence.initializeLaunch.mutate();
          console.log('[SOC2] Launch evidence collection initialized');
        } catch (evidenceError) {
          console.warn('[SOC2] Failed to initialize launch evidence:', evidenceError);
        }
        
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ShoppingStoreProvider>
          <EvidenceCollector>
            <GestureHandlerRootView>
              <SecurityAlertBanner />
              <RootLayoutNav />
            </GestureHandlerRootView>
          </EvidenceCollector>
        </ShoppingStoreProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}