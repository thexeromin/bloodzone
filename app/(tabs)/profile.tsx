import { View, Text } from "react-native";
import { useAuth } from "@/context";

export default function Profile() {
  const { user } = useAuth();
  return (
    <View>
      <Text>Profile</Text>
      <Text>User: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
    </View>
  );
}
