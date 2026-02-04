import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { useAuth } from "@/context";
import { getBloodRequests, initiateChat } from "@/services";

import BloodRequestCard from "./blood-request-card";

interface Props {
  showFilter?: boolean;
  limit?: number;
  headerTitle?: string;
  horizontal?: boolean;
}

const RADIUS_OPTIONS = [5, 10, 20, 50];
const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "O+"];

export default function BloodRequestFeed({
  showFilter = false,
  limit,
  horizontal = false
}: Props) {
  const router = useRouter();
  const { fetchWithAuth, user } = useAuth();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [radius, setRadius] = useState(10);
  const [selectedBlood, setSelectedBlood] = useState("All");

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("radius", radius.toString());
      if (selectedBlood !== "All") params.append("bloodType", selectedBlood);

      const response = await getBloodRequests(fetchWithAuth, params);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        let data = result.data.map((item: any) => ({
          id: item._id,
          user_id: item.user?._id,
          image: item.user?.avatar || "",
          bloodNeed: item.bloodType,
          address: item.address,
          distance: "2.5 km" // Placeholder calculation
        }));

        if (limit && data.length > limit) data = data.slice(0, limit);
        setRequests(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [radius, selectedBlood, limit, fetchWithAuth]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleContact = async (id: string) => {
    try {
      const response = await initiateChat(fetchWithAuth, { targetUserId: id });
      const result = await response.json();
      if (result.success) {
        const otherUser = result.chatRoom.participants.find(
          (p: any) => p._id !== user?._id
        );
        router.push({
          pathname: `/chat/[id]`,
          params: {
            id: `${result.chatRoom._id}`,
            recipientName: otherUser?.name || "Donor"
          }
        });
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect.");
    }
  };

  // Filter header
  const FilterHeader = () => (
    <View style={styles.filterWrapper}>
      {/* Radius Filters */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={RADIUS_OPTIONS}
        keyExtractor={(item) => `r-${item}`}
        contentContainerStyle={styles.filterScroll}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, radius === item && styles.activeChip]}
            onPress={() => setRadius(item)}
          >
            <Text
              style={[
                styles.chipText,
                radius === item && styles.activeChipText
              ]}
            >
              {item} km
            </Text>
          </TouchableOpacity>
        )}
      />
      {/* Blood Group Filters */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={BLOOD_GROUPS}
        keyExtractor={(item) => `b-${item}`}
        contentContainerStyle={[styles.filterScroll, { marginTop: 8 }]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedBlood === item && styles.activeChip
            ]}
            onPress={() => setSelectedBlood(item)}
          >
            <Text
              style={[
                styles.chipText,
                selectedBlood === item && styles.activeChipText
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Show Filters if requested */}
      {showFilter && <FilterHeader />}

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={requests}
          horizontal={horizontal}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={horizontal ? styles.horizontalItem : styles.verticalItem}
            >
              <BloodRequestCard {...item} onSendMessage={handleContact} />
            </View>
          )}
          contentContainerStyle={[
            styles.listContent,
            horizontal ? { paddingLeft: 20 } : { paddingHorizontal: 20 }
          ]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            !horizontal ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchFeed();
                }}
                tintColor={Colors.primary}
              />
            ) : undefined
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>No requests found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 40, paddingTop: 10 },
  verticalItem: { width: "100%" },
  horizontalItem: { width: 300, marginRight: 12 },
  centerBox: { padding: 40, alignItems: "center" },

  filterWrapper: {
    paddingVertical: 12,
    backgroundColor: Colors.background
  },
  filterScroll: {
    paddingHorizontal: 20
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8
  },
  activeChip: {
    backgroundColor: Colors.textMain,
    borderColor: Colors.textMain
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSub
  },
  activeChipText: {
    color: "#fff",
    fontWeight: "600"
  },

  // Empty State
  emptyContainer: { alignItems: "center", marginTop: 50, opacity: 0.6 },
  emptyText: { marginTop: 10, color: Colors.textMuted }
});
