import {
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { ThemeColors } from "@/constants";
import BloodRequestForm from "@/components/blood-request-form";

export default function BloodRequest() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: ThemeColors.primaryContent }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Request Blood</Text>
        <Text style={styles.subHeader}>Quickly find donors nearby</Text>

        <BloodRequestForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 40,
    backgroundColor: ThemeColors.screenBackground
  },
  header: {
    marginBottom: 5,
    fontWeight: "bold",
    color: ThemeColors.primaryContent,
    fontSize: 26,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  subHeader: {
    fontSize: 16,
    color: ThemeColors.secondaryContent,
    marginBottom: 30
  }
});
