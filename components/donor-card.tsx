import { useMemo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

interface DonorCardProps {
  name: string;
  bloodGroup: string;
  distance?: string; // e.g. "2.5 km"
  lastDonated?: string; // ISO Date string
  avatar?: string;
  onChat: () => void;
}

export default function DonorCard({
  name,
  bloodGroup,
  distance,
  lastDonated,
  avatar,
  onChat
}: DonorCardProps) {
  // Simple check for eligibility visualization
  const isEligible = useMemo(() => {
    if (!lastDonated) return true;
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return new Date(lastDonated) <= threeMonthsAgo;
  }, [lastDonated]);

  return (
    <View style={styles.card}>
      {/* Avatar Section */}
      <Image
        source={
          avatar ? { uri: avatar } : require("@/assets/images/avatar.jpg")
        }
        style={styles.avatar}
      />

      {/* Info Section */}
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: isEligible ? "#E8F5E9" : "#FFF3E0" }
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isEligible ? Colors.success : Colors.warning }
              ]}
            >
              {isEligible ? "Eligible" : "Resting"}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.bloodCircle}>
            <Text style={styles.bloodText}>{bloodGroup}</Text>
          </View>
          {distance && <Text style={styles.distance}>• {distance} away</Text>}
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.chatBtn} onPress={onChat}>
        <Ionicons name="chatbubble-ellipses" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0"
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center"
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textMain,
    marginRight: 8,
    maxWidth: 120
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold"
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  bloodCircle: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6
  },
  bloodText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "bold"
  },
  distance: {
    color: Colors.textSub,
    fontSize: 12
  },
  chatBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#FFEBEE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8
  }
});
