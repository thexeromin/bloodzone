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
import * as Application from "expo-application";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { ThemeColors } from "@/constants";

// Reusable Menu Item Component
const MenuItem = ({ icon, label, onPress, isDestructive = false }: any) => (
  <TouchableOpacity
    style={[styles.menuItem, isDestructive && styles.menuItemDestructive]}
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
          {/* TODO: add setting */}
          {/*<TouchableOpacity>
            <Ionicons
              name="settings-outline"
              size={24}
              color={ThemeColors.primaryContent}
            />
          </TouchableOpacity>*/}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* --- PROFILE INFO --- */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  user?.picture
                    ? { uri: user.picture }
                    : require("@/assets/images/avatar.jpg")
                }
                style={styles.profilePhoto}
              />
              {/* TODO: update avatar */}
              {/*<View style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color="#fff" />
              </View>*/}
            </View>

            <Text style={styles.nameText}>{user?.name || "User Name"}</Text>
            <Text style={styles.emailText}>
              {user?.email || "user@example.com"}
            </Text>
          </View>

          {/* --- MENU OPTIONS --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.menuGroup}>
              <MenuItem
                icon="person-outline"
                label="Edit Profile"
                onPress={() => {}}
              />
              <MenuItem
                icon="notifications-outline"
                label="Notifications"
                onPress={() => {}}
              />
              <MenuItem
                icon="shield-checkmark-outline"
                label="Privacy & Security"
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.menuGroup}>
              <MenuItem
                icon="help-buoy-outline"
                label="Help & Support"
                onPress={() => {}}
              />
              <MenuItem
                icon="document-text-outline"
                label="Terms & Policies"
                onPress={() => {}}
              />
            </View>
          </View>

          {/* --- LOGOUT SECTION --- */}
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
        {/* --- FOOTER --- */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Infinity Health Services
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
    backgroundColor: ThemeColors.screenBackground
  },
  scrollContent: {
    paddingBottom: 40
  },

  // Header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 25 : 10,
    paddingBottom: 20
  },
  headerTitle: {
    fontSize: 28,
    color: ThemeColors.primaryContent,
    fontFamily: Platform.select({
      android: "Poppins_700Bold",
      ios: "Poppins-Bold"
    })
  },

  // Profile Card
  profileCard: {
    alignItems: "center",
    marginBottom: 30
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 15
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: ThemeColors.surfaceBackground
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: ThemeColors.accent,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: ThemeColors.screenBackground
  },
  nameText: {
    fontSize: 22,
    fontWeight: "600",
    color: ThemeColors.primaryContent,
    fontFamily: Platform.select({
      android: "Poppins_600SemiBold",
      ios: "Poppins-SemiBold"
    })
  },
  emailText: {
    fontSize: 14,
    color: ThemeColors.secondaryContent,
    marginTop: 4
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
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1
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
    backgroundColor: ThemeColors.surfaceBackground, // Keep bg consistent or make slightly red
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
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center" // Center everything
  },
  logoutButtonModern: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 69, 58, 0.1)", // Faint Red Background
    paddingVertical: 16,
    width: "100%", // Full width
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
  },

  // Footer
  footer: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border || "rgba(255,255,255,0.05)"
  },
  footerText: {
    color: ThemeColors.secondaryContent,
    fontSize: 12,
    opacity: 0.5
  }
});
