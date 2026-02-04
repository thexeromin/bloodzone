import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

const ActionItem = ({
  icon,
  title,
  isDestructive = false,
  onPress,
  noBorder = false
}: any) => (
  <TouchableOpacity
    style={[styles.itemContainer, noBorder && { borderBottomWidth: 0 }]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.leftContent}>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: isDestructive ? Colors.errorBg : Colors.background
          }
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? Colors.error : Colors.primary}
        />
      </View>
      <Text style={[styles.itemTitle, isDestructive && styles.textDestructive]}>
        {title}
      </Text>
    </View>

    {!isDestructive && (
      <Ionicons name="chevron-forward" size={16} color={Colors.border} />
    )}
  </TouchableOpacity>
);

export default function PrivacyScreen() {
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This will permanently delete your profile, chats, and data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Logic to delete account API here")
        }
      ]
    );
  };

  const openLink = (url: string) => {
    Alert.alert("Link Opened", `Would open: ${url}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <Stack.Screen
        options={{
          title: "Privacy & Security",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textMain,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "800", fontSize: 20 }
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerDescription}>
          Review our policies or manage your account data.
        </Text>

        {/* Section: Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Legal</Text>
          <View style={styles.card}>
            <ActionItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => openLink("https://example.com/terms")}
            />
            <ActionItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => openLink("https://example.com/privacy")}
            />
            <ActionItem
              icon="information-circle-outline"
              title="About Infinity Health"
              noBorder={true}
              onPress={() => openLink("https://example.com/about")}
            />
          </View>
        </View>

        {/* Section: Account */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account Data</Text>
          <View style={styles.card}>
            <ActionItem
              icon="trash-outline"
              title="Delete Account"
              isDestructive={true}
              noBorder={true}
              onPress={handleDeleteAccount}
            />
          </View>
          <Text style={styles.footerNote}>
            Deleting your account will immediately remove all your data from our
            servers.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  headerDescription: {
    color: Colors.textSub,
    marginBottom: 25,
    fontSize: 14,
    lineHeight: 20
  },

  section: {
    marginBottom: 30
  },
  sectionHeader: {
    color: Colors.textSub,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 1,
    marginLeft: 10
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    // Clean Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)"
  },
  footerNote: {
    marginTop: 10,
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 10,
    lineHeight: 18
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },
  itemTitle: {
    fontSize: 15,
    color: Colors.textMain,
    fontWeight: "600"
  },
  textDestructive: {
    color: Colors.error
  }
});
