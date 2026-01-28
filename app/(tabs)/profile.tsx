import {
  Image,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Application from "expo-application";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { ThemeColors } from "@/constants";

// Reusable Menu Item Component
const MenuItem = ({
  icon,
  label,
  onPress,
  isDestructive = false,
  noBorder = false
}: any) => (
  <TouchableOpacity
    style={[
      styles.menuItem,
      isDestructive && styles.menuItemDestructive,
      noBorder && { borderBottomWidth: 0 }
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.iconContainer,
        isDestructive ? styles.iconDestructive : styles.iconNeutral
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isDestructive ? "#FF453A" : ThemeColors.accent}
      />
    </View>
    <Text style={[styles.menuText, isDestructive && styles.textDestructive]}>
      {label}
    </Text>
    <Ionicons
      name="chevron-forward"
      size={18}
      color={ThemeColors.secondaryContent}
      style={{ opacity: 0.5 }}
    />
  </TouchableOpacity>
);

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const appVersion = Application.nativeApplicationVersion;

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => signOut()
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* --- HEADER --- */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* --- PROFILE HERO CARD --- */}
          <View style={styles.profileHero}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  user?.picture
                    ? { uri: user.picture }
                    : require("@/assets/images/avatar.jpg")
                }
                style={styles.profilePhoto}
              />
              {/* Optional: Status Badge */}
              <View style={styles.statusBadge}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.nameText}>{user?.name || "User Name"}</Text>
              <Text style={styles.emailText}>
                {user?.email || "user@example.com"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push("/settings/edit-profile")}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Single menu section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.menuGroup}>
              <MenuItem
                icon="notifications-outline"
                label="Notifications"
                onPress={() => router.push("/notifications")}
              />
              <MenuItem
                icon="shield-checkmark-outline"
                label="Privacy & Security"
                onPress={() => router.push("/settings/privacy")}
              />
              <MenuItem
                icon="help-buoy-outline"
                label="Help & Support"
                onPress={() => router.push("/settings/help")}
                noBorder={true}
              />
            </View>
          </View>

          {/* Logout section */}
          <View style={styles.logoutSection}>
            <TouchableOpacity
              style={styles.logoutButtonModern}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#FF453A"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.logoutTextModern}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version {appVersion}</Text>
          </View>
        </ScrollView>
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
    backgroundColor: ThemeColors.screenBackground
  },
  scrollContent: {
    paddingBottom: 40
  },

  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 10
  },
  headerTitle: {
    fontSize: 28,
    color: ThemeColors.primaryContent,
    fontFamily: Platform.select({
      android: "Poppins_700Bold",
      ios: "Poppins-Bold"
    })
  },

  // Profile Hero
  profileHero: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: ThemeColors.surfaceBackground
  },
  statusBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#32D74B", // Green success color
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: ThemeColors.screenBackground
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20
  },
  nameText: {
    fontSize: 24,
    fontWeight: "600",
    color: ThemeColors.primaryContent,
    marginBottom: 4,
    fontFamily: Platform.select({
      android: "Poppins_600SemiBold",
      ios: "Poppins-SemiBold"
    })
  },
  emailText: {
    fontSize: 14,
    color: ThemeColors.secondaryContent
  },

  // Edit Profile Button (Pill Shape)
  editProfileButton: {
    backgroundColor: ThemeColors.surfaceBackground,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ThemeColors.border || "rgba(255,255,255,0.1)"
  },
  editProfileText: {
    color: ThemeColors.primaryContent,
    fontSize: 14,
    fontWeight: "600"
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: ThemeColors.secondaryContent,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4
  },
  menuGroup: {
    backgroundColor: ThemeColors.surfaceBackground,
    borderRadius: 16,
    overflow: "hidden"
  },

  // Menu Item
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border || "rgba(255,255,255,0.05)"
  },
  menuItemDestructive: {
    backgroundColor: ThemeColors.surfaceBackground,
    borderRadius: 16,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 58, 0.2)"
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },
  iconNeutral: {
    backgroundColor: "rgba(255, 255, 255, 0.05)"
  },
  iconDestructive: {
    backgroundColor: "rgba(255, 69, 58, 0.1)"
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: ThemeColors.primaryContent,
    fontWeight: "500"
  },
  textDestructive: {
    color: "#FF453A",
    fontWeight: "600"
  },

  // Logout Specific
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center"
  },
  logoutButtonModern: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 69, 58, 0.1)", // Faint Red Background
    paddingVertical: 16,
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FF453A" // Solid Red Border
  },
  logoutTextModern: {
    color: "#FF453A",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5
  },
  versionText: {
    textAlign: "center",
    marginTop: 15,
    color: ThemeColors.secondaryContent,
    fontSize: 12,
    opacity: 0.6
  }
});
