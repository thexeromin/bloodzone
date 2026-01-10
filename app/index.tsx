import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeColors } from "@/constants";

import GoogleLoginButton from "@/components/google-login-button";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.messageBlock}>
          <Text style={styles.brand}>Lifeline</Text>

          <Text style={styles.headline}>Someone needs blood today.</Text>

          <Text style={styles.subtext}>
            Lifeline connects donors with real people in critical need.
          </Text>
        </View>

        <View style={styles.actionBlock}>
          <GoogleLoginButton />

          <Text style={styles.disclaimer}>
            We only use your information to support blood donation.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ThemeColors.screenBackground
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "space-between"
  },
  messageBlock: {
    marginTop: 96
  },
  brand: {
    fontSize: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: ThemeColors.placeholder,
    marginBottom: 18
  },
  headline: {
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 42,
    letterSpacing: -0.6,
    color: ThemeColors.primaryContent,
    marginBottom: 18
  },
  subtext: {
    fontSize: 17,
    lineHeight: 26,
    color: ThemeColors.secondaryContent,
    maxWidth: "92%"
  },
  actionBlock: {
    paddingBottom: 28
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 13,
    lineHeight: 20,
    color: ThemeColors.placeholder,
    textAlign: "center"
  }
});
