import { AuthProvider, useAuth } from "@/context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

function InitialLayout() {
  const { user } = useAuth();

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
      <StatusBar style="dark" />
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </>
  );
}
