import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Inbox",
          headerShown: false,
          headerShadowVisible: false
        }}
      />
    </Stack>
  );
}
