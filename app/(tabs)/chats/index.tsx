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
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { getMyChats } from "@/services";
import { ThemeColors } from "@/constants";

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
      setError("Network error. Please try again.");
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
        style={styles.chatItem}
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
            <Ionicons
              name="person-circle"
              size={50}
              color={ThemeColors.placeholder}
            />
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

          <Text
            style={[
              styles.lastMsg,
              !item.lastMessage && { fontStyle: "italic", opacity: 0.7 }
            ]}
            numberOfLines={1}
          >
            {item.lastMessage || "Start chatting..."}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Messages</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={ThemeColors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && chats.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={ThemeColors.dangerSecondary}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadChats}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ThemeColors.accent}
            colors={[ThemeColors.accent]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={64}
              color={ThemeColors.placeholder}
            />
            <Text style={styles.emptyTitle}>No messages yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.screenBackground
  },
  // Header style
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: ThemeColors.screenBackground
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: ThemeColors.primaryContent
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  listContent: {
    paddingBottom: 20 // Add some padding at bottom of list
  },

  // Chat item style
  chatItem: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center"
    // borderBottomWidth: 1,
    // borderBottomColor: ThemeColors.border
  },
  avatarContainer: {
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ThemeColors.surfaceBackground
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
    color: ThemeColors.primaryContent,
    flex: 1,
    marginRight: 10,
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  timeText: {
    fontSize: 12,
    color: ThemeColors.secondaryContent,
    fontWeight: "500"
  },
  lastMsg: {
    color: ThemeColors.secondaryContent,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  errorText: {
    marginTop: 10,
    color: ThemeColors.secondaryContent,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: ThemeColors.surfaceBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ThemeColors.border
  },
  retryText: {
    color: ThemeColors.primaryContent,
    fontWeight: "600"
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 40
  },
  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColors.placeholder
  }
});
