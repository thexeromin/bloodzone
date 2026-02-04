import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

interface ManageRequestCardProps {
  item: {
    _id: string;
    bloodType: string;
    address: string;
    createdAt: string;
    status: "active" | "fulfilled";
    neededBy: string;
  };
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "active" | "fulfilled") => void;
}

export default function ManageRequestCard({
  item,
  onDelete,
  onUpdateStatus
}: ManageRequestCardProps) {
  const isFulfilled = item.status === "fulfilled";

  return (
    <View style={[styles.card, isFulfilled && styles.cardDimmed]}>
      {/* Header: Date & Status */}
      <View style={styles.header}>
        <Text style={styles.date}>
          Posted {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View
          style={[
            styles.badge,
            isFulfilled ? styles.badgeGray : styles.badgeRed
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isFulfilled ? styles.textGray : styles.textRed
            ]}
          >
            {isFulfilled ? "FULFILLED" : "ACTIVE"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.bloodCircle}>
          <Text style={styles.bloodText}>{item.bloodType}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.address} numberOfLines={2}>
            {item.address}
          </Text>
          <Text style={styles.neededBy}>
            Needed by: {new Date(item.neededBy).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {/* Delete Button (Always Visible) */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(item._id)}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

        {/* Status Toggle (Only if Active) */}
        {!isFulfilled ? (
          <TouchableOpacity
            style={styles.fulfillBtn}
            onPress={() => onUpdateStatus(item._id, "fulfilled")}
          >
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.fulfillText}>Mark Fulfilled</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedMessage}>
            <Ionicons name="heart" size={14} color={Colors.textSub} />
            <Text style={styles.completedText}>Donation received</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  cardDimmed: {
    opacity: 0.8,
    backgroundColor: "#fafafa"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  date: {
    fontSize: 12,
    color: Colors.textSub
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  badgeRed: { backgroundColor: "#FEF2F2" },
  badgeGray: { backgroundColor: "#F3F4F6" },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  textRed: { color: "#DC2626" },
  textGray: { color: "#6B7280" },

  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  bloodCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight || "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  bloodText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold"
  },
  info: { flex: 1 },
  address: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textMain,
    marginBottom: 4
  },
  neededBy: {
    fontSize: 12,
    color: Colors.textSub
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8
  },
  deleteText: {
    color: Colors.error,
    fontWeight: "600",
    fontSize: 13
  },
  fulfillBtn: {
    backgroundColor: Colors.success || "#10B981",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  fulfillText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13
  },
  completedMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 8
  },
  completedText: {
    color: Colors.textSub,
    fontSize: 12,
    fontStyle: "italic"
  }
});
