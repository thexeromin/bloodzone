import {
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants";
import BloodRequestForm from "@/components/blood-request-form";

export default function BloodRequest() {
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Request Blood</Text>
              <Text style={styles.subHeader}>Quickly find donors nearby</Text>
            </View>

            {/* Form Component */}
            <BloodRequestForm />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40
  },

  // Header Styles
  headerContainer: {
    marginTop: 10,
    marginBottom: 30
  },
  header: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.textMain,
    letterSpacing: -1,
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto"
  },
  subHeader: {
    fontSize: 16,
    color: Colors.textSub,
    fontWeight: "500"
  }
});
