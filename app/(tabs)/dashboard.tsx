import { useAuth } from "@/context";
import { View, Text, Pressable } from "react-native";

export default function Dashboard() {
  const { signOut, user } = useAuth();

  return (
    <View>
      <Text>Dashboard</Text>
      <Text>{JSON.stringify(user)}</Text>
      <Pressable onPress={signOut}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
