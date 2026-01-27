import { Tabs, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColors } from "@/constants";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: ThemeColors.screenBackground,
          borderTopWidth: 0
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: ThemeColors.dangerSecondary,
        tabBarInactiveTintColor: ThemeColors.secondaryContent
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
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
            // This resets the stack!
            router.push("/(tabs)/chats/");
          }
        })}
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
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
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={24}
            />
          )
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          )
        }}
      />
    </Tabs>
  );
}
