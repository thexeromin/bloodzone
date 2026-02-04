import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

// MOCK DATA
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
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const getIconData = (type: string) => {
    switch (type) {
      case "alert":
        return {
          name: "alert-circle",
          color: Colors.error,
          bg: Colors.errorBg
        };
      case "success":
        return {
          name: "checkmark-circle",
          color: Colors.success,
          bg: Colors.successBg
        };
      case "message":
        return { name: "chatbubble", color: "#2196F3", bg: "#E3F2FD" }; // Custom Blue
      default:
        return {
          name: "information-circle",
          color: Colors.warning,
          bg: Colors.warningBg
        };
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1500);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const renderItem = ({ item }: any) => {
    const { name, color, bg } = getIconData(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, !item.read && styles.unreadCard]}
        activeOpacity={0.8}
        onPress={() => markAsRead(item.id)}
      >
        {/* Left: Icon */}
        <View style={[styles.iconCircle, { backgroundColor: bg }]}>
          <Ionicons name={name as any} size={22} color={color} />
        </View>

        {/* Middle: Text */}
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, !item.read && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
        </View>

        {/* Right: Unread Dot */}
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <Stack.Screen
        options={{
          title: "Notifications",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textMain,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "800", fontSize: 20 },
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color={Colors.textMuted}
              />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up! Check back later.
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
    backgroundColor: Colors.background // Soft Grey
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 40
  },
  clearText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600"
  },

  // Notification Card
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: "flex-start",
    // Soft Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)"
  },
  unreadCard: {
    borderColor: Colors.primaryLight, // Subtle border for unread
    backgroundColor: "#fff" // Keep white bg for cleanliness
  },

  // Icon
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },

  // Text Content
  textContainer: {
    flex: 1,
    justifyContent: "center"
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textMain,
    flex: 1,
    marginRight: 8
  },
  unreadTitle: {
    fontWeight: "700",
    color: Colors.textMain
  },
  time: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "500"
  },
  body: {
    fontSize: 13,
    color: Colors.textSub,
    lineHeight: 18
  },

  // Indicators
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginLeft: 8
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 40
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textMain,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSub,
    textAlign: "center",
    lineHeight: 22
  }
});
