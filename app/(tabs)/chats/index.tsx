import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { getMyChats } from "@/services";
import { Colors } from "@/constants";

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
};

export default function ChatList() {
  const router = useRouter();
  const { fetchWithAuth, user } = useAuth();

  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChats = async () => {
    try {
      setError(null);
      const res = await getMyChats(fetchWithAuth);
      const data = await res.json();

      if (data.success) {
        setChats(data.data);
      } else {
        setError("Failed to load conversations.");
      }
    } catch (e) {
      console.error(e);
      setError("Network error.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadChats();
  };

  const renderItem = ({ item }: any) => {
    const otherUser = item.participants.find(
      (p: any) => p._id !== user?._id
    ) || { name: "Unknown", avatar: null };

    return (
      <TouchableOpacity
        style={styles.chatCard}
        activeOpacity={0.7}
        onPress={() => {
          router.push({
            pathname: `/chat/[id]`,
            params: { id: `${item._id}`, recipientName: otherUser.name }
          });
        }}
      >
        <View style={styles.avatarContainer}>
          {otherUser.avatar ? (
            <Image
              source={{ uri: otherUser.avatar }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name} numberOfLines={1}>
              {otherUser.name}
            </Text>
            {item.lastMessageTime && (
              <Text style={styles.timeText}>
                {formatTime(item.lastMessageTime)}
              </Text>
            )}
          </View>

          <View style={styles.messageRow}>
            <Text
              style={[
                styles.lastMsg,
                !item.lastMessage && {
                  fontStyle: "italic",
                  color: Colors.textMuted
                }
              ]}
              numberOfLines={1}
            >
              {item.lastMessage || "Start chatting..."}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={16}
          color={Colors.border}
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : error && chats.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={Colors.textMuted}
            />
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity onPress={loadChats} style={{ marginTop: 10 }}>
              <Text style={{ color: Colors.primary, fontWeight: "600" }}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={64}
                  color={Colors.border}
                />
                <Text style={styles.emptyText}>No messages yet</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 15
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.textMain,
    letterSpacing: -1
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  emptyText: {
    marginTop: 10,
    color: Colors.textMuted,
    fontSize: 16
  },

  chatCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    alignItems: "center",
    // Subtle Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  avatarContainer: {
    marginRight: 16
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.border
  },
  placeholderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center"
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center"
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textMain,
    flex: 1,
    marginRight: 10
  },
  timeText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "500"
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  lastMsg: {
    color: Colors.textSub,
    fontSize: 14,
    lineHeight: 20,
    flex: 1
  }
});
