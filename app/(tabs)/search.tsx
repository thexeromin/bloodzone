import { View, StyleSheet } from "react-native";
import { ThemeColors } from "@/constants";

import Recipients from "@/components/recipients";

export default function Search() {
  return (
    <View style={styles.container}>
      <Recipients showFilter={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: ThemeColors.screenBackground
  }
});
