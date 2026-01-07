import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import { useAuth } from "@/context";
import UserStats from "@/components/user-stats";

export default function Dashboard() {
  const { signOut, user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <UserStats />

      <Text>{JSON.stringify(user)}</Text>
      <Pressable onPress={signOut}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingHorizontal: 20,
    backgroundColor: "#171717",
    flex: 1
  },
  header: {
    fontSize: 26,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    }),
    color: "#F5F3F4"
  }
});
