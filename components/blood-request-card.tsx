import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

export interface Props {
  id: string;
  user_id: string;
  image: string;
  bloodNeed: string;
  address: string;
  distance?: string;
  onSendMessage?: (id: string) => void;
}

export default function BloodRequestCard({
  user_id,
  image,
  bloodNeed,
  address,
  distance,
  onSendMessage
}: Props) {
  return (
    <View style={styles.card}>
      {/* LEFT: Bold Blood Group Indicator */}
      <View style={styles.bloodContainer}>
        <View style={styles.bloodCircle}>
          <Text style={styles.bloodText}>{bloodNeed}</Text>
        </View>
        <Text style={styles.urgentText}>URGENT</Text>
      </View>

      {/* MIDDLE: Info Details */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.hospitalName} numberOfLines={1}>
            Blood Request
          </Text>
          {distance && (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{distance}</Text>
            </View>
          )}
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSub} />
          <Text style={styles.addressText} numberOfLines={2}>
            {address}
          </Text>
        </View>

        {/* User Info (Mini) */}
        <View style={styles.userRow}>
          <Image
            source={{ uri: image || "https://via.placeholder.com/50" }}
            style={styles.userAvatar}
          />
          <Text style={styles.postedBy}>Posted by Donor</Text>
        </View>
      </View>

      {/* RIGHT: Action Arrow */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => onSendMessage?.(user_id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={22}
          color={Colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border
  },

  // Left Side
  bloodContainer: {
    alignItems: "center",
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    marginRight: 12,
    minWidth: 60
  },
  bloodCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4
  },
  bloodText: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.primary
  },
  urgentText: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.error,
    letterSpacing: 0.5
  },

  // Middle
  infoContainer: {
    flex: 1,
    justifyContent: "center"
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textMain
  },
  distanceBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  distanceText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B"
  },
  locationRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start"
  },
  addressText: {
    fontSize: 12,
    color: Colors.textSub,
    marginLeft: 4,
    flex: 1
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  userAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 6,
    backgroundColor: "#eee"
  },
  postedBy: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "500"
  },

  // Right Side
  actionBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center"
  }
});
