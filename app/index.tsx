import React from "react";

import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleLoginButton from "@/components/google-login-button";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top Branding */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue to your account
          </Text>
        </View>

        {/* Bottom Action */}
        <View style={styles.footer}>
          <GoogleLoginButton />
          <Text style={styles.terms}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40
  },
  header: {
    marginTop: 40
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24
  },
  logoText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700"
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 22
  },
  footer: {
    alignItems: "center"
  },
  terms: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18
  }
});
