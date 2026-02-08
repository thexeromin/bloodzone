import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "@/context";
import { ToastProvider } from "@/context/toast";

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { user, isProfileComplete } = useAuth();
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack>
      {/* User is logged in AND profile is complete */}
      <Stack.Protected guard={!!user && isProfileComplete}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="find-donors" options={{ headerShown: false }} />

        <Stack.Screen name="my-requests" options={{ headerShown: false }} />

        <Stack.Screen name="chat/[id]" options={{ headerShown: true }} />
      </Stack.Protected>

      {/* User is logged in BUT profile is incomplete */}
      <Stack.Protected guard={!!user && !isProfileComplete}>
        <Stack.Screen
          name="complete-profile"
          options={{ headerShown: false, title: "Complete Setup" }}
        />
      </Stack.Protected>

      {/* User is NOT logged in */}
      <Stack.Protected guard={!user}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: ""
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <AuthProvider>
        <ToastProvider>
          <InitialLayout />
        </ToastProvider>
      </AuthProvider>
    </>
  );
}
