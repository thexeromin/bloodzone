import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "@/constants";

// Simple Action Row Component
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
        style={[styles.iconContainer, isDestructive && styles.iconDestructive]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? "#FF453A" : ThemeColors.accent}
        />
      </View>
      <Text style={[styles.itemTitle, isDestructive && styles.textDestructive]}>
        {title}
      </Text>
    </View>

    {/* Arrow Icon only for non-destructive actions */}
    {!isDestructive && (
      <Ionicons
        name="chevron-forward"
        size={20}
        color={ThemeColors.secondaryContent}
        style={{ opacity: 0.5 }}
      />
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
    // For now, just alerts. TODO: Linking.openURL('https://our-website.com/privacy');
    Alert.alert("Link Opened", `Would open: ${url}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Privacy & Security",
          headerStyle: { backgroundColor: ThemeColors.screenBackground },
          headerTintColor: ThemeColors.primaryContent,
          headerShadowVisible: false
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerDescription}>
          Review our policies or manage your account data.
        </Text>

        {/* Section legal */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Legal</Text>
          <View style={styles.sectionBody}>
            <ActionItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => openLink("https://example.com/terms")}
            />
            <ActionItem
              icon="shield-outline"
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

        {/* Section account */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <View style={styles.sectionBody}>
            <ActionItem
              icon="trash-outline"
              title="Delete Account"
              isDestructive={true}
              noBorder={true}
              onPress={handleDeleteAccount}
            />
          </View>
          <Text style={styles.footerNote}>
            Deleting your account will remove all your data from our servers.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.screenBackground
  },
  scrollContent: {
    padding: 20
  },
  headerDescription: {
    color: ThemeColors.secondaryContent,
    marginBottom: 25,
    fontSize: 14
  },
  section: {
    marginBottom: 30
  },
  sectionHeader: {
    color: ThemeColors.secondaryContent,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1,
    marginLeft: 5
  },
  sectionBody: {
    backgroundColor: ThemeColors.surfaceBackground,
    borderRadius: 16,
    overflow: "hidden"
  },
  footerNote: {
    marginTop: 10,
    fontSize: 12,
    color: ThemeColors.secondaryContent,
    marginLeft: 5,
    opacity: 0.7
  },

  // Item Styles
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border || "rgba(255,255,255,0.05)"
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  iconDestructive: {
    backgroundColor: "rgba(255, 69, 58, 0.1)"
  },
  itemTitle: {
    fontSize: 16,
    color: ThemeColors.primaryContent,
    fontWeight: "500"
  },
  textDestructive: {
    color: "#FF453A"
  }
});
