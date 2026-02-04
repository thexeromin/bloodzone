import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context";
import { getBloodRequests, initiateChat } from "@/services";
import { Colors } from "@/constants";

export default function DashboardUrgentRequests() {
  const router = useRouter();
  const { fetchWithAuth, user } = useAuth();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUrgent = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("radius", "50");

      const response = await getBloodRequests(fetchWithAuth, params);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const data = result.data.slice(0, 5).map((item: any) => ({
          id: item._id,
          user_id: item.user?._id,
          title: item.address || item.user?.name || "Unknown Location",
          type: item.bloodType,
          distance: "2.5 km",
          urgent: true
        }));
        setRequests(data);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchUrgent();
  }, [fetchUrgent]);

  const handleContact = async (targetId: string, recipientName: string) => {
    try {
      if (!user) return;

      // Don't chat with yourself
      if (targetId === user._id) {
        Alert.alert("Oops", "You cannot contact yourself.");
        return;
      }

      const response = await initiateChat(fetchWithAuth, {
        targetUserId: targetId
      });
      const result = await response.json();

      if (result.success) {
        router.push({
          pathname: `/chat/[id]`,
          params: {
            id: result.chatRoom._id,
            recipientName: recipientName
          }
        });
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to requester.");
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.reqCard}>
      <View style={styles.reqHeader}>
        <View style={styles.bloodTag}>
          <Text style={styles.bloodTagText}>{item.type}</Text>
        </View>
        {item.urgent && (
          <View style={styles.urgentTag}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
      </View>

      <Text style={styles.reqTitle} numberOfLines={1}>
        {item.title}
      </Text>

      <View style={styles.reqMeta}>
        <Ionicons name="location-outline" size={14} color={Colors.textSub} />
        <Text style={styles.reqDistance}>{item.distance} away</Text>
      </View>

      {/* UPDATED BUTTON: Contact instead of Donate */}
      <TouchableOpacity
        style={styles.contactBtn}
        onPress={() => handleContact(item.user_id, item.title)}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={16} color="#fff" />
        <Text style={styles.contactBtnText}>Contact</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading)
    return (
      <ActivityIndicator
        size="small"
        color={Colors.primary}
        style={{ marginVertical: 20 }}
      />
    );
  if (requests.length === 0) return null; // Hide section if empty

  return (
    <FlatList
      horizontal
      data={requests}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  reqCard: {
    backgroundColor: "#fff",
    width: 180,
    padding: 16,
    borderRadius: 20,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)"
  },
  reqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  bloodTag: {
    backgroundColor: Colors.primaryLight || "#FFEBEE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  bloodTagText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 12
  },
  urgentTag: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6
  },
  urgentText: {
    color: "#DC2626",
    fontSize: 10,
    fontWeight: "bold"
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textMain,
    marginBottom: 6
  },
  reqMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14
  },
  reqDistance: {
    fontSize: 12,
    color: Colors.textSub,
    marginLeft: 4
  },
  // UPDATED BUTTON STYLES
  contactBtn: {
    backgroundColor: Colors.textMain, // Dark/Black button for high contrast
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row", // Aligns icon and text
    justifyContent: "center",
    alignItems: "center",
    gap: 6
  },
  contactBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold"
  }
});
