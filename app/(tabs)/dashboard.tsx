import { useAuth } from "@/provider";
import { View, Text, Pressable } from "react-native";

export default function Dashboard() {
  const { signOut } = useAuth();

  return (
    <View>
      <Text>Dashboard</Text>
      <Pressable onPress={signOut}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
