import { AuthProvider, useAuth } from "@/context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { user } = useAuth();
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium
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
      <Stack.Protected guard={user ? true : false}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

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
        <InitialLayout />
      </AuthProvider>
    </>
  );
}
