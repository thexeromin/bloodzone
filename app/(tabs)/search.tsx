import { View, StyleSheet, Text, Platform } from "react-native";
import { ThemeColors } from "@/constants";

import Recipients from "@/components/recipients";

export default function Search() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search</Text>

      <Recipients showFilter={true} />
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
