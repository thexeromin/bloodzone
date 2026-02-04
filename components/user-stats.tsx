import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { getUserStats, logDonation } from "@/services";
import { Colors } from "@/constants";

export default function UserStats() {
  const { fetchWithAuth } = useAuth();

  const [stats, setStats] = useState({
    bloodGroup: "...",
    totalDonation: 0,
    lastDonated: null as string | null
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  // Fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  // Calculate eligibility
  useEffect(() => {
    if (stats.lastDonated) {
      const lastDate = new Date(stats.lastDonated);
      const today = new Date();

      // Standard rule: 3 months (approx 90 days) is safer for whole blood,
      // but if your rule is 30 days, keep it as is.
      const nextEligibleDate = new Date(lastDate);
      nextEligibleDate.setDate(lastDate.getDate() + 56); // Standard is 56 days (8 weeks)

      const diffTime = nextEligibleDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setDaysRemaining(diffDays > 0 ? diffDays : 0);
    } else {
      setDaysRemaining(0);
    }
  }, [stats.lastDonated]);

  const isEligible = daysRemaining <= 0;

  const fetchStats = async () => {
    try {
      const res = await getUserStats(fetchWithAuth);
      const data = await res.json();
      if (data.success) {
        setStats({
          bloodGroup: data.data.bloodGroup || "N/A",
          totalDonation: data.data.totalDonation || 0,
          lastDonated: data.data.lastDonated || null
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

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
        setStats((prev) => ({
          ...prev,
          totalDonation: result.data.totalDonations, // Ensure this matches API key
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Colors.primary} size="small" />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.heroContainer}>
        <LinearGradient
          colors={isEligible ? ["#D32F2F", "#EF5350"] : ["#475569", "#64748B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroTop}>
            <View style={styles.statusPill}>
              <Ionicons
                name={isEligible ? "checkmark-circle" : "hourglass"}
                size={14}
                color="#fff"
              />
              <Text style={styles.statusPillText}>
                {isEligible ? "Ready to Donate" : "Recovery Mode"}
              </Text>
            </View>
            <Ionicons
              name="heart-circle"
              size={40}
              color="rgba(255,255,255,0.2)"
            />
          </View>

          <Text style={styles.heroMainText}>
            {isEligible
              ? "Your donation can save 3 lives today."
              : `Next donation eligible in ${daysRemaining} days.`}
          </Text>

          {isEligible ? (
            <TouchableOpacity
              style={styles.actionBtnWhite}
              onPress={() => handleDonationClick()}
              disabled={updating}
            >
              <Text style={styles.actionBtnTextRed}>I Donated Today</Text>
            </TouchableOpacity>
          ) : (
            // Simple progress bar visualization
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "10%" }]} />
            </View>
          )}
        </LinearGradient>
      </View>

      {/* --- STATS OVERVIEW (NOW DYNAMIC) --- */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          {/* 1. Real Blood Group */}
          <Text style={styles.statValue}>{stats.bloodGroup}</Text>
          <Text style={styles.statLabel}>Blood Type</Text>
        </View>

        <View style={styles.statCard}>
          {/* 2. Real Total Donations */}
          <Text style={styles.statValue}>
            {stats.totalDonation < 10
              ? `0${stats.totalDonation}`
              : stats.totalDonation}
          </Text>
          <Text style={styles.statLabel}>Donations</Text>
        </View>

        <View style={styles.statCard}>
          {/* 3. Real Lives Saved (Total * 3) */}
          <Text style={styles.statValue}>{stats.totalDonation * 3}</Text>
          <Text style={styles.statLabel}>Lives Saved</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    padding: 20,
    alignItems: "center"
  },
  heroContainer: {
    paddingHorizontal: 20,
    marginBottom: 25
  },
  heroGradient: {
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  statusPillText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6
  },
  heroMainText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 30,
    maxWidth: "90%",
    marginBottom: 20
  },
  actionBtnWhite: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12
  },
  actionBtnTextRed: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 14
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    width: "100%"
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 30
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textMain,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSub,
    fontWeight: "500",
    textTransform: "uppercase"
  }
});
