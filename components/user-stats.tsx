import { useState, useRef, useEffect } from "react";
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
import { useAuth, useToast } from "@/context";
import { getUserStats, logDonation } from "@/services";
import { Colors } from "@/constants";

interface UserStatsData {
  bloodGroup: string;
  totalDonation: number;
  lastDonated: string | null;
}

export default function UserStats() {
  const { fetchWithAuth } = useAuth();
  const { showToast, hideToast } = useToast();

  const [stats, setStats] = useState<UserStatsData>({
    bloodGroup: "...",
    totalDonation: 0,
    lastDonated: null
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Undo Logic State
  // TODO: 'any' for the timer to avoid React Native vs Node type conflicts
  const undoTimerRef = useRef<any>(null);
  const prevStatsRef = useRef<UserStatsData | null>(null);

  // Eligibility State
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [recoveryProgress, setRecoveryProgress] = useState(0); // 0 to 100%

  useEffect(() => {
    fetchStats();

    return () => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  // Calculate eligibility & Progress
  useEffect(() => {
    if (stats.lastDonated) {
      const lastDate = new Date(stats.lastDonated);
      const today = new Date();

      const RECOVERY_DAYS = 90;

      const nextEligibleDate = new Date(lastDate);
      nextEligibleDate.setDate(lastDate.getDate() + RECOVERY_DAYS);

      const diffTime = nextEligibleDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setDaysRemaining(diffDays);
        const daysPassed = RECOVERY_DAYS - diffDays;
        const percent = (daysPassed / RECOVERY_DAYS) * 100;
        setRecoveryProgress(percent);
      } else {
        setDaysRemaining(0);
        setRecoveryProgress(100);
      }
    } else {
      setDaysRemaining(0);
      setRecoveryProgress(100);
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

  const performOptimisticUpdate = () => {
    // 1. Snapshot current stats so we can undo later
    prevStatsRef.current = { ...stats };

    // 2. Optimistically update UI immediately
    const todayStr = new Date().toISOString();
    setStats((prev) => ({
      ...prev,
      totalDonation: prev.totalDonation + 1,
      lastDonated: todayStr
    }));

    // 3. Define what happens if the user clicks "UNDO"
    const handleUndoAction = () => {
      // Stop the delayed API call
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }
      // Revert the UI instantly
      if (prevStatsRef.current) {
        setStats(prevStatsRef.current);
      }
      // Toast hides automatically via Context logic
    };

    // 4. Trigger the Global Toast
    showToast("Marked as Donated", handleUndoAction);

    // 5. Start the "Point of No Return" Timer (5 Seconds)
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
    }

    undoTimerRef.current = setTimeout(async () => {
      // Time is up! Commit to server.
      await saveDonationToServer();
      hideToast(); // Close the toast cleanly
    }, 5000);
  };

  const saveDonationToServer = async () => {
    try {
      setUpdating(true);
      const res = await logDonation(fetchWithAuth);
      const result = await res.json();

      if (result.success) {
        // Optional: Sync with exact server data to be safe
        setStats((prev) => ({
          ...prev,
          totalDonation: result.data.totalDonation,
          lastDonated: result.data.lastDonated
        }));
      } else {
        // If server failed, we must revert manually and alert user
        Alert.alert("Error", result.message || "Failed to save donation.");
        if (prevStatsRef.current) setStats(prevStatsRef.current);
      }
    } catch (error) {
      Alert.alert("Connection Error", "Could not save donation.");
      if (prevStatsRef.current) setStats(prevStatsRef.current);
    } finally {
      setUpdating(false);
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
          onPress: performOptimisticUpdate // Call our new function
        }
      ]
    );
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
              ? "Your donation can save 1 life today."
              : `Next donation eligible in ${daysRemaining} days.`}
          </Text>

          {isEligible ? (
            <TouchableOpacity
              style={styles.actionBtnWhite}
              onPress={() => handleDonationClick()}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#D32F2F" />
              ) : (
                <Text style={styles.actionBtnTextRed}>I Donated Today</Text>
              )}
            </TouchableOpacity>
          ) : (
            // Dynamic Progress Bar
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${recoveryProgress}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(recoveryProgress)}% Recovered
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* --- STATS OVERVIEW --- */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.bloodGroup}</Text>
          <Text style={styles.statLabel}>Blood Type</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.totalDonation < 10
              ? `0${stats.totalDonation}`
              : stats.totalDonation}
          </Text>
          <Text style={styles.statLabel}>Donations</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalDonation}</Text>
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
    flex: 1,
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

  // Updated Progress Bar Styles
  progressBarWrapper: {
    width: "100%"
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    width: "100%",
    marginBottom: 8
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3
  },
  progressText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right"
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
