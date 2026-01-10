import { Image, View, Text, StyleSheet, Platform } from "react-native";
import { useAuth } from "@/context";
import { ThemeColors } from "@/constants";

import UserDetailsForm from "@/components/user-details-form";

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.profileInfoContainer}>
        <Image
          source={
            user?.picture
              ? { uri: user.picture }
              : require("@/assets/images/avatar.jpg")
          }
          style={styles.profilePhoto}
        />

        <Text style={styles.nameText}>{user?.name}</Text>

        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <UserDetailsForm onSignOut={signOut} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Infinity Health Services
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 20,
    backgroundColor: ThemeColors.screenBackground
  },
  header: {
    color: ThemeColors.primaryContent,
    fontSize: 26,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  profileInfoContainer: {
    alignItems: "center",
    padding: 20
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12
  },
  nameText: {
    fontSize: 24,
    color: ThemeColors.primaryContent,
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  emailText: {
    marginTop: 1,
    fontSize: 16,
    color: ThemeColors.secondaryContent,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  footer: {
    marginTop: 50 * 2,
    paddingBottom: 20,
    alignItems: "center"
  },
  footerText: {
    color: "#aaa",
    fontSize: 14
  }
});
