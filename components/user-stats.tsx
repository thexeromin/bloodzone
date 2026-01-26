import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { getUserStats, logDonation } from "@/services";
import { ThemeColors, Colors } from "@/constants";

export default function UserStats() {
  const { fetchWithAuth } = useAuth();

  const [stats, setStats] = useState({
    bloodGroup: "...",
    totalDonation: 0,
    lastDonated: null as string | null
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 1. Fetch Stats on Mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getUserStats(fetchWithAuth);
      const data = await res.json();
      if (data.success) {
        console.log(data.data);
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle "I Donated" Click
  const handleDonationClick = () => {
    Alert.alert(
      "Confirm Donation",
      "Did you donate blood recently? This will update your profile stats.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, I Donated",
          onPress: performUpdate
        }
      ]
    );
  };

  const performUpdate = async () => {
    try {
      setUpdating(true);
      const res = await logDonation(fetchWithAuth);
      const result = await res.json();

      if (result.success) {
        // Update local state immediately
        setStats((prev) => ({
          ...prev,
          totalDonations: result.data.totalDonations,
          lastDonated: result.data.lastDonated
        }));
        Alert.alert("Thank You!", "Your donation has been recorded.");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <ActivityIndicator color={ThemeColors.accent} />;

  // Helper to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top Row: 3 Stats Columns */}
        <View style={styles.statsRow}>
          {/* Stat 1: Blood Group */}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.bloodGroup}</Text>
            <Text style={styles.statLabel}>Blood Group</Text>
          </View>

          <View style={styles.divider} />

          {/* Stat 2: Donations */}
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: ThemeColors.accent }]}>
              {stats.totalDonation}
            </Text>
            <Text style={styles.statLabel}>Donated</Text>
          </View>

          <View style={styles.divider} />

          {/* Stat 3: Last Date */}
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { fontSize: 16, marginTop: 4 }]}>
              {formatDate(stats.lastDonated)}
            </Text>
            <Text style={styles.statLabel}>Last Date</Text>
          </View>
        </View>

        {/* Bottom Row: Action Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDonationClick}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={Colors.neutral900}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>I Donated Today</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20
  },
  loaderContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    backgroundColor: ThemeColors.surfaceBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    // Dark Shadow logic
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25
  },
  statItem: {
    flex: 1,
    alignItems: "center"
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: ThemeColors.border
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: ThemeColors.primaryContent,
    marginBottom: 4,
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  statValueSmall: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColors.primaryContent,
    marginTop: 6,
    marginBottom: 2,
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  statLabel: {
    fontSize: 12,
    color: ThemeColors.secondaryContent,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  actionButton: {
    backgroundColor: ThemeColors.accent,
    borderRadius: 25,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: Colors.neutral900,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  }
});
