import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";
import AuthLayout from "@/components/AuthLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TabVisibilityProvider } from "@/context/TabVisibilityContext";
import { PortalProvider } from "@gorhom/portal";


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkAndConvexProvider>
        <SafeAreaProvider>
          <PortalProvider>
            <AuthLayout />
          </PortalProvider>
        </SafeAreaProvider>
      </ClerkAndConvexProvider>
    </GestureHandlerRootView>
  );
}
