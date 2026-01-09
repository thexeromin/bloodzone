import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColors } from "@/constants";

export default function TabLayout() {
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
