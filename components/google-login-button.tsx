import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "@/context";
import { Colors, ThemeColors } from "@/constants";

export default function GoogleLoginButton() {
  const { signIn } = useAuth();

  return (
    <Pressable
      onPress={signIn}
      style={({ pressed }) => [
        styles.googleButton,
        pressed && styles.googlePressed
      ]}
    >
      <View style={styles.googleIcon}>
        <Text style={styles.googleIconText}>G</Text>
      </View>

      <View>
        <Text style={styles.googlePrimary}>Continue with Google</Text>
        <Text style={styles.googleSecondary}>
          Used only for donor verification
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 20,
    backgroundColor: ThemeColors.surfaceBackground,
    borderWidth: 1,
    borderColor: ThemeColors.border
  },
  googlePressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96
  },
  googleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ThemeColors.primaryContent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16
  },
  googleIconText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.neutral900
  },
  googlePrimary: {
    fontSize: 16,
    fontWeight: "600",
    color: ThemeColors.primaryContent,
    marginBottom: 2
  },
  googleSecondary: {
    fontSize: 13,
    color: ThemeColors.placeholder
  }
});
