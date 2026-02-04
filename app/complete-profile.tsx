import React from "react";
import { Text, View, StyleSheet, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context";
import { Colors } from "@/constants";
import UserDetailsForm from "@/components/user-details-form";

export default function CompleteProfile() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>Complete Profile</Text>
          <Text style={styles.subHeading}>
            Please provide your details to continue
          </Text>

          <UserDetailsForm onSignOut={signOut} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background // Soft Grey
  },
  safeArea: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    // Move content up slightly to avoid keyboard hiding inputs
    paddingBottom: 40
  },
  heading: {
    color: Colors.textMain,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto"
  },
  subHeading: {
    color: Colors.textSub,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40
  }
});
