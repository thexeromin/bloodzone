import { View, Text, Platform, StyleSheet } from "react-native";
import { ThemeColors } from "@/constants";

import UserStats from "@/components/user-stats";
import Recipients from "@/components/recipients";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <UserStats />

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
    fontSize: 28,
    color: ThemeColors.primaryContent,
    fontFamily: Platform.select({
      android: "Poppins_700Bold",
      ios: "Poppins-Bold"
    })
  }
});
