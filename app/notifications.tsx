import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  RefreshControl
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "@/constants";

// TODO: work on notifications
const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    type: "alert", // alert | message | success | info
    title: "Urgent Blood Request",
    body: "A patient nearby needs O+ blood urgently. Can you help?",
    time: "2m ago",
    read: false
  },
  {
    id: "2",
    type: "success",
    title: "Request Fulfilled",
    body: "Thank you! The donation for Case #1023 was successful.",
    time: "1h ago",
    read: false
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    body: "Dr. Sarah sent you a message regarding the donation camp.",
    time: "3h ago",
    read: true
  },
  {
    id: "4",
    type: "info",
    title: "System Update",
    body: "We have updated our privacy policy and terms of service.",
    time: "1d ago",
    read: true
  }
];
INITIAL_NOTIFICATIONS.length = 0;

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  // Helper to get Icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return { name: "alert-circle", color: "#FF453A" }; // Red
      case "success":
        return { name: "checkmark-circle", color: "#32D74B" }; // Green
      case "message":
        return { name: "chatbubble", color: "#0A84FF" }; // Blue
      default:
        return { name: "information-circle", color: "#FF9F0A" }; // Orange
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1500);
  };

  const markAsRead = (id: string) => {
    // Optimistic update to remove "unread" dot
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const renderItem = ({ item }: any) => {
    const iconData = getIcon(item.type);

    return (
      <TouchableOpacity
        style={[styles.itemContainer, !item.read && styles.unreadBackground]}
        activeOpacity={0.7}
        onPress={() => markAsRead(item.id)}
      >
        {/* Icon Column */}
        <View style={styles.iconColumn}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${iconData.color}20` }
            ]}
          >
            <Ionicons
              name={iconData.name as any}
              size={24}
              color={iconData.color}
            />
          </View>
        </View>

        {/* Text Column */}
        <View style={styles.textColumn}>
          <View style={styles.headerRow}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={styles.bodyText} numberOfLines={2}>
            {item.body}
          </Text>
        </View>

        {/* Unread Dot Column */}
        {!item.read && (
          <View style={styles.dotColumn}>
            <View style={styles.unreadDot} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerStyle: { backgroundColor: ThemeColors.screenBackground },
          headerTintColor: ThemeColors.primaryContent,
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={() => setNotifications([])}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )
        }}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={ThemeColors.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color={ThemeColors.secondaryContent}
              />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You&apos;re all caught up! Check back later for updates.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.screenBackground
  },
  listContent: {
    paddingVertical: 10
  },
  clearText: {
    color: ThemeColors.accent,
    fontSize: 14,
    fontWeight: "600"
  },

  // List Item
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border || "rgba(255,255,255,0.05)",
    alignItems: "flex-start"
  },
  unreadBackground: {
    backgroundColor: "rgba(255,255,255,0.02)" // Very subtle highlight for unread
  },

  // Icon
  iconColumn: {
    marginRight: 16,
    paddingTop: 2 // Align icon with title text
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },

  // Text
  textColumn: {
    flex: 1
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColors.primaryContent,
    flex: 1,
    marginRight: 10
  },
  timeText: {
    fontSize: 12,
    color: ThemeColors.secondaryContent,
    fontWeight: "500"
  },
  bodyText: {
    fontSize: 14,
    color: ThemeColors.secondaryContent,
    lineHeight: 20
  },

  // Unread Dot
  dotColumn: {
    justifyContent: "center",
    marginLeft: 10,
    paddingTop: 8
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.accent
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ThemeColors.surfaceBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColors.primaryContent,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: ThemeColors.secondaryContent,
    textAlign: "center",
    lineHeight: 22
  }
});
