import { View, Text, Platform, StyleSheet } from "react-native";
import UserStats from "@/components/user-stats";
import EmergencyRecipients from "@/components/emergency-recipients";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <UserStats donations={100} bloodType="AB+" lastDonated={20} />

      <EmergencyRecipients />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 20,
    backgroundColor: "#171717"
  },
  header: {
    color: "#F5F3F4",
    fontSize: 26,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  }
});
