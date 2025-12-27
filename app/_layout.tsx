import { AuthProvider, useAuth } from "@/provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

function InitialLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
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
      <StatusBar style="dark" />
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </>
  );
}
