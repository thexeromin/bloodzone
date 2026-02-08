import { Tabs, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants";
import { Platform } from "react-native";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function TabLayout() {
  const router = useRouter();
  usePushNotifications();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#94A3B8", // Soft Grey

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 85 : 65,
          paddingTop: Platform.OS === "ios" ? 10 : 0,

          // Shadow styling (Floating Effect)
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 8 // Android Shadow
        }
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={22}
              color={color}
            />
          )
        }}
      />

      <Tabs.Screen
        name="donate"
        options={{
          title: "Donate",
          tabBarIcon: ({ color, focused }) => (
            // CHANGED: 'water' looks exactly like a blood drop
            <Ionicons
              name={focused ? "water" : "water-outline"}
              color={color}
              size={24}
            />
          )
        }}
      />

      <Tabs.Screen
        name="blood-request"
        options={{
          title: "Request Blood",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
              size={24}
            />
          )
        }}
      />

      <Tabs.Screen
        name="chats"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action (which is just switching tabs)
            e.preventDefault();

            // Navigate explicitly to the index (Inbox)
            // This resets the chatting
            router.push("/(tabs)/chats");
          }
        })}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={24}
              color={color}
            />
          )
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  );
}
