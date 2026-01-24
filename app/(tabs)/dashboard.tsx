import { View, Text, Platform, StyleSheet } from "react-native";
import { ThemeColors } from "@/constants";
import { useAuth } from "@/context";

import UserStats from "@/components/user-stats";
import Recipients from "@/components/recipients";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <UserStats
        donations={100}
        bloodType={user?.bloodGroup || "NULL"}
        lastDonated={20}
      />

      <Recipients title="Emergency Recipients" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 20,
    backgroundColor: ThemeColors.screenBackground
  },
  header: {
    color: ThemeColors.primaryContent,
    fontSize: 26,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  }
});
