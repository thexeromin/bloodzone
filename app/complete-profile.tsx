import { Text, View, StyleSheet, Platform } from "react-native";
import { useAuth } from "@/context";
import { ThemeColors } from "@/constants";
import UserDetailsForm from "@/components/user-details-form";

export default function LoginScreen() {
  const { signOut, handleProfileComplete } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Complete your profile</Text>
      <UserDetailsForm onSignOut={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    backgroundColor: ThemeColors.screenBackground
  },
  heading: {
    color: ThemeColors.primaryContent,
    fontSize: 24,
    textAlign: "center",
    marginTop: 100,
    marginBottom: 24,

    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  }
});
