import { View, StyleSheet, Text, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants";
import BloodRequestFeed from "@/components/blood-request-feed";

export default function DonateScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          {/* UPDATED TEXT */}
          <Text style={styles.headerTitle}>Donate Blood</Text>
          <Text style={styles.headerSub}>Help save a life nearby</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* The feed component you already have */}
          <BloodRequestFeed showFilter={true} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: Colors.background
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.textMain,
    letterSpacing: -1,
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto"
  },
  headerSub: {
    fontSize: 16,
    color: Colors.textSub,
    fontWeight: "500"
  },
  content: {
    flex: 1
  }
});
