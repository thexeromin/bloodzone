import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@/context";

export default function GoogleLoginButton() {
  const { signIn } = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={signIn}
      >
        {/* add google icon */}
        <FontAwesome
          name="google"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center"
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "90%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3
  },
  icon: {
    marginRight: 12
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000"
  }
});
