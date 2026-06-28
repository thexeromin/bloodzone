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
import { useLocation } from "@/hooks/useLocation";

import BloodRequestCard from "./blood-request-card";

// Calculate Distance (Haversine Formula)
const getDistance = (
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Radius of earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return d.toFixed(1) + " km";
};

const deg2rad = (deg: number) => deg * (Math.PI / 180);

interface Props {
  showFilter?: boolean;
  limit?: number;
  headerTitle?: string;
  horizontal?: boolean;
}

const RADIUS_OPTIONS = [5, 10, 20, 50];
const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodRequestFeed({
  showFilter = false,
  limit,
  horizontal = false
}: Props) {
  const router = useRouter();
  const { fetchWithAuth, user } = useAuth();

  const { location, loading: locationLoading } = useLocation();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [radius, setRadius] = useState(10);
  const [selectedBlood, setSelectedBlood] = useState("All");

  const fetchFeed = useCallback(async () => {
    if (locationLoading) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("radius", radius.toString());
      if (selectedBlood !== "All") params.append("bloodType", selectedBlood);

      // Pass user location to API if available (for server-side filtering)
      if (location) {
        params.append("lat", location.coords.latitude.toString());
        params.append("lng", location.coords.longitude.toString());
      }

      const response = await getBloodRequests(fetchWithAuth, params);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        let data = result.data.map((item: any) => ({
          id: item._id,
          user_id: item.user?._id,
          image: item.user?.avatar || "",
          userName: item.user?.name || "Unknown",
          bloodNeed: item.bloodType,
          address: item.address,
          locationCoords: item.location?.coordinates, // [lng, lat]
          createdAt: item.createdAt
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
  }, [radius, selectedBlood, limit, fetchWithAuth, location, locationLoading]); // Re-fetch if location loads

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

  const FilterHeader = () => (
    <View style={styles.filterWrapper}>
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
      {showFilter && <FilterHeader />}

      {loading || locationLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 12, color: Colors.textMuted }}>
            {locationLoading ? "Getting location..." : "Loading requests..."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          horizontal={horizontal}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            let distString = "Unknown";

            if (location && item.locationCoords) {
              // MongoDB: [Longitude, Latitude]
              const itemLng = item.locationCoords[0];
              const itemLat = item.locationCoords[1];

              const d = getDistance(
                location.coords.latitude,
                location.coords.longitude,
                itemLat,
                itemLng
              );
              if (d) distString = d;
            }

            return (
              <View
                style={horizontal ? styles.horizontalItem : styles.verticalItem}
              >
                <BloodRequestCard
                  {...item}
                  distance={distString} // Pass calculated distance
                  onSendMessage={handleContact}
                />
              </View>
            );
          }}
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
  emptyContainer: { alignItems: "center", marginTop: 50, opacity: 0.6 },
  emptyText: { marginTop: 10, color: Colors.textMuted }
});
