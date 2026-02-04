import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { Colors } from "@/constants";

export default function GoogleLoginButton() {
  const { signIn } = useAuth();

  return (
    <TouchableOpacity
      style={styles.googleButton}
      activeOpacity={0.8}
      onPress={() => signIn()}
    >
      <View style={styles.googleIconWrapper}>
        <Ionicons name="logo-google" size={20} color="#EA4335" />
      </View>
      <Text style={styles.googleButtonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: "100%",
    marginBottom: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  googleIconWrapper: { marginRight: 15 },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textMain
  }
});
