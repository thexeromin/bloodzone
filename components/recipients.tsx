import { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors, Colors } from "@/constants";
import { useAuth } from "@/context";
import { getBloodRequests } from "@/services";

import Recipient from "./recipient";

interface Props {
  title?: string;
  showFilter?: boolean;
}

interface FeedItem {
  id: string;
  image: string;
  bloodNeed: string;
  address: string;
}

// Filter Options
const RADIUS_OPTIONS = [5, 10, 20, 50, 100]; // Kilometers
const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Recipients({ title, showFilter = false }: Props) {
  const { fetchWithAuth } = useAuth();

  // State
  const [recipients, setRecipients] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [radius, setRadius] = useState(10); // Default 10km
  const [selectedBlood, setSelectedBlood] = useState("All");

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);

      // Build Query Params (Only Radius & BloodType)
      const params = new URLSearchParams();
      params.append("radius", radius.toString());

      if (selectedBlood !== "All") {
        params.append("bloodType", selectedBlood);
      }

      // Final URL: /api/blood-requests?radius=10&bloodType=A+
      const response = await getBloodRequests(fetchWithAuth, params);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // Map API response to UI State
        const formattedData: FeedItem[] = result.data.map((item: any) => ({
          id: item._id,
          image: item.user?.avatar || "",
          bloodNeed: item.bloodType,
          address: item.address
        }));

        setRecipients(formattedData);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [radius, selectedBlood, fetchWithAuth]);

  // TODO: implement messaging
  const handleSendMessage = (id: string) => {
    alert(`Send message to recipient ${id}`);
  };

  // Trigger fetch when Filters change
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  // --- RENDER FILTERS ---
  const renderFilters = () => (
    <View style={styles.filterContainer}>
      {/* Radius Filter */}
      <View style={styles.filterRow}>
        <Ionicons
          name="location-outline"
          size={18}
          color={ThemeColors.secondaryContent}
          style={{ marginRight: 8 }}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={RADIUS_OPTIONS}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, radius === item && styles.chipSelected]}
              onPress={() => setRadius(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  radius === item && styles.chipTextSelected
                ]}
              >
                {item} km
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Blood Group Filter */}
      <View style={[styles.filterRow, { marginTop: 10 }]}>
        <Ionicons
          name="water-outline"
          size={18}
          color={ThemeColors.secondaryContent}
          style={{ marginRight: 8 }}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BLOOD_GROUPS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedBlood === item && styles.chipSelected
              ]}
              onPress={() => setSelectedBlood(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedBlood === item && styles.chipTextSelected
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {title && (
        <>
          <Text style={styles.heading}>{title}</Text>

          <View style={styles.divider} />
        </>
      )}

      {/* Filters Section */}
      {showFilter && renderFilters()}

      {/* Recipients List */}
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={ThemeColors.accent} />
          <Text>Fetching your location...</Text>
        </View>
      ) : (
        <FlatList
          data={recipients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Recipient {...item} onSendMessage={handleSendMessage} />
          )}
          contentContainerStyle={styles.recipientsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[ThemeColors.accent]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingVertical: 16
  },
  heading: {
    marginBottom: 8,
    color: ThemeColors.secondaryContent,
    fontSize: 20,
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  divider: {
    width: "100%",
    height: 1,
    marginBottom: 16,
    backgroundColor: ThemeColors.border
  },
  recipientsContainer: {
    gap: 12,
    paddingBottom: 16
  },

  // --- FILTERS STYLES ---
  filterContainer: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    marginBottom: 25
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: ThemeColors.surfaceBackground,
    borderWidth: 1,
    borderColor: ThemeColors.border
  },
  chipSelected: {
    backgroundColor: ThemeColors.accent
  },
  chipText: {
    fontSize: 13,
    color: ThemeColors.secondaryContent,
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  chipTextSelected: {
    color: Colors.neutral900
  }
});
