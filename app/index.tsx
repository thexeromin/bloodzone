import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform
} from "react-native";
import * as Application from "expo-application";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import GoogleLoginButton from "@/components/google-login-button";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const appVersion = Application.nativeApplicationVersion || "1.0.0";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.heroContainer}>
        <LinearGradient
          colors={Colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="water" size={52} color={Colors.primary} />
            </View>

            <Text style={styles.appName}>BloodZone</Text>
            <Text style={styles.tagline}>Every Drop Counts.</Text>
          </View>

          <View style={[styles.circleDeco, styles.circleOne]} />
          <View style={[styles.circleDeco, styles.circleTwo]} />
        </LinearGradient>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.loginCard}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeSub}>
            Join the community saving lives daily.
          </Text>

          <GoogleLoginButton />

          <Text style={styles.termsText}>
            By continuing, you agree to our{" "}
            <Text style={styles.linkText}>Terms</Text> &{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version {appVersion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },

  // Hero
  heroContainer: {
    height: height * 0.45,
    overflow: "hidden",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  heroGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  heroContent: {
    alignItems: "center",
    zIndex: 10,
    marginTop: -20
  },
  logoCircle: {
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto"
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500"
  },

  // Decor
  circleDeco: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 999
  },
  circleOne: { width: 300, height: 300, top: -100, right: -100 },
  circleTwo: { width: 200, height: 200, bottom: -50, left: -80 },

  // Card
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -60
  },
  loginCard: {
    width: width * 0.85,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textMain,
    marginBottom: 8
  },
  welcomeSub: {
    fontSize: 14,
    color: Colors.textSub,
    textAlign: "center",
    marginBottom: 30
  },

  // Footer Links
  termsText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "600"
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center"
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: 12
  }
});
