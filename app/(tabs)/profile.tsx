import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Application from "expo-application";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { Colors } from "@/constants";

const ProfileMenuItem = ({
  icon,
  label,
  onPress,
  isDestructive,
  color = Colors.textMain
}: any) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.iconBox,
        { backgroundColor: isDestructive ? Colors.errorBg : Colors.background }
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isDestructive ? Colors.error : color}
      />
    </View>
    <Text style={[styles.menuLabel, isDestructive && { color: Colors.error }]}>
      {label}
    </Text>
    <Ionicons name="chevron-forward" size={16} color={Colors.border} />
  </TouchableOpacity>
);

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const appVersion = Application.nativeApplicationVersion || "1.0.0";

  // TODO: work on verification
  const isVerified = false;

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => signOut() }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  user?.picture
                    ? { uri: user.picture }
                    : require("@/assets/images/avatar.jpg")
                }
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.editBadge}
                onPress={() => router.push("/settings/edit-profile")}
              >
                <Ionicons name="pencil" size={12} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || "John Doe"}</Text>
              <Text style={styles.userEmail}>
                {user?.email || "user@example.com"}
              </Text>

              {/* Verification badge */}
              {isVerified ? (
                <View style={styles.verifiedBadge}>
                  <Ionicons
                    name="shield-checkmark"
                    size={12}
                    color={Colors.success}
                  />
                  <Text style={styles.verifiedText}>Verified Donor</Text>
                </View>
              ) : (
                <View style={styles.unverifiedBadge}>
                  <Ionicons
                    name="alert-circle"
                    size={12}
                    color={Colors.warning}
                  />
                  <Text style={styles.unverifiedText}>Not Verified</Text>
                </View>
              )}
            </View>
          </View>

          {/* Menus */}
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuGroup}>
            <ProfileMenuItem
              icon="person-outline"
              label="Personal Details"
              onPress={() => router.push("/settings/edit-profile")}
              color={Colors.primary}
            />
            <ProfileMenuItem
              icon="notifications-outline"
              label="Notifications"
              onPress={() => router.push("/notifications")}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuGroup}>
            <ProfileMenuItem
              icon="lock-closed-outline"
              label="Privacy & Security"
              onPress={() => router.push("/settings/privacy")}
              color={Colors.primary}
            />
            <ProfileMenuItem
              icon="help-buoy-outline"
              label="Help & Support"
              onPress={() => router.push("/settings/help")}
              color={Colors.primary}
            />
          </View>

          {/* Footer */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version {appVersion}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 40 },

  // Header
  header: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20 },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.textMain,
    letterSpacing: -1
  },

  // User Card
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  avatarContainer: { position: "relative", marginRight: 16 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.border
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.textMain,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff"
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textMain,
    marginBottom: 2
  },
  userEmail: { fontSize: 13, color: Colors.textSub, marginBottom: 8 },

  // Verified badge
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: Colors.successBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.success,
    marginLeft: 4,
    textTransform: "uppercase"
  },

  // Unverified badge
  unverifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: Colors.warningBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  unverifiedText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.warning,
    marginLeft: 4,
    textTransform: "uppercase"
  },

  // Menu
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSub,
    marginBottom: 10,
    marginLeft: 24,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  menuGroup: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 8,
    marginBottom: 25
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textMain
  },

  // Footer
  logoutButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.errorBg,
    backgroundColor: Colors.surface
  },
  logoutText: { color: Colors.error, fontWeight: "bold", fontSize: 16 },
  versionText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.textMuted,
    fontSize: 12
  }
});
