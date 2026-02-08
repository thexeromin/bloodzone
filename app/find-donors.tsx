import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

import { useAuth } from "@/context";
import { findDonors, initiateChat } from "@/services";
import { Colors } from "@/constants";
import DonorCard from "@/components/donor-card";
import { useLocation } from "@/hooks/useLocation";

// Constants
const RADIUS_OPTIONS = [5, 10, 20, 50];
const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Calculate Distance (Haversine Formula)
const getDistance = (
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Radius of the earth in km
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

  return d.toFixed(1);
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export default function FindDonorsScreen() {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const { location, loading: gpsLoading, errorMsg } = useLocation();

  const [apiLoading, setApiLoading] = useState(false);
  const [donors, setDonors] = useState<any[]>([]);

  const [radius, setRadius] = useState(10);
  const [selectedBlood, setSelectedBlood] = useState("All");

  const fetchData = useCallback(
    async (currentLoc: Location.LocationObject | null) => {
      setApiLoading(true);
      try {
        const params = new URLSearchParams();

        if (currentLoc) {
          params.append("lat", currentLoc.coords.latitude.toString());
          params.append("lng", currentLoc.coords.longitude.toString());
        }

        params.append("radius", radius.toString());
        if (selectedBlood !== "All") {
          params.append("bloodGroup", selectedBlood);
        }

        const response = await findDonors(fetchWithAuth, params);
        const data = await response.json();

        if (data.success) {
          setDonors(data.data);
        } else {
          if (data.code === "LOCATION_MISSING") {
            Alert.alert(
              "Location Needed",
              "We couldn't find your GPS location. Please update your profile address.",
              [
                { text: "Go Back", onPress: () => router.back() },
                {
                  text: "Update Profile",
                  onPress: () => router.push("/(tabs)/profile")
                }
              ]
            );
          } else {
            setDonors([]);
          }
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Something went wrong fetching donors.");
      } finally {
        setApiLoading(false);
      }
    },
    [radius, selectedBlood, fetchWithAuth]
  );

  useEffect(() => {
    if (!gpsLoading) {
      fetchData(location);
    }
  }, [gpsLoading, location, radius, selectedBlood]);

  const handleChat = async (targetId: string, name: string) => {
    try {
      const res = await initiateChat(fetchWithAuth, { targetUserId: targetId });
      const data = await res.json();
      if (data.success) {
        router.push({
          pathname: `/chat/[id]`,
          params: { id: data.chatRoom._id, recipientName: name }
        });
      }
    } catch (e) {
      Alert.alert("Error", "Could not start chat.");
    }
  };

  const isLoading = gpsLoading || apiLoading;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Donors</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Radius:</Text>
            <FlatList
              horizontal
              data={RADIUS_OPTIONS}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.chip, radius === item && styles.chipActive]}
                  onPress={() => setRadius(item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      radius === item && styles.chipTextActive
                    ]}
                  >
                    {item}km
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.filterRow}>
            <FlatList
              horizontal
              data={BLOOD_GROUPS}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.bloodChip,
                    selectedBlood === item && styles.bloodChipActive
                  ]}
                  onPress={() => setSelectedBlood(item)}
                >
                  <Text
                    style={[
                      styles.bloodChipText,
                      selectedBlood === item && styles.bloodChipTextActive
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          <Text style={styles.resultCount}>
            {isLoading
              ? "Searching..."
              : `${donors.length} donors found nearby`}
          </Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{ marginTop: 40 }}
            />
          ) : (
            <FlatList
              data={donors}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                // --- CALCULATE REAL DISTANCE ---
                // MongoDB GeoJSON format is [Longitude, Latitude]
                // item.location.coordinates[0] = Longitude
                // item.location.coordinates[1] = Latitude

                let distString = "Unknown";

                if (location && item.location?.coordinates) {
                  const d = getDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    item.location.coordinates[1], // Lat
                    item.location.coordinates[0] // Long
                  );
                  if (d) distString = `${d} km`;
                }

                return (
                  <DonorCard
                    name={item.name}
                    bloodGroup={item.bloodGroup || "?"}
                    avatar={item.avatar}
                    lastDonated={item.lastDonated}
                    distance={`${distString} away`} // Passes real distance
                    onChat={() => handleChat(item._id, item.name)}
                  />
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={60} color="#ddd" />
                  <Text style={styles.emptyText}>
                    No donors found matching criteria.
                  </Text>
                  <TouchableOpacity onPress={() => setRadius(50)}>
                    <Text style={styles.retryText}>Try increasing radius</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  backBtn: { padding: 8, borderRadius: 20, backgroundColor: "#f9f9f9" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: Colors.textMain },
  filterSection: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff"
  },
  filterRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
    color: Colors.textSub
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8
  },
  chipActive: { backgroundColor: Colors.textMain },
  chipText: { fontSize: 13, color: Colors.textSub },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  bloodChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 8
  },
  bloodChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  bloodChipText: { fontWeight: "bold", color: Colors.textMain },
  bloodChipTextActive: { color: "#fff" },
  listContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingTop: 16
  },
  resultCount: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSub,
    marginBottom: 12
  },
  emptyState: { alignItems: "center", justifyContent: "center", marginTop: 60 },
  emptyText: { marginTop: 12, fontSize: 16, color: Colors.textMuted },
  retryText: { marginTop: 8, color: Colors.primary, fontWeight: "600" }
});
