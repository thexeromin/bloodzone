import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/context";
import { getMyRequests, deleteRequest, updateRequestStatus } from "@/services";
import { Colors } from "@/constants";
import ManageRequestCard from "@/components/manage-request-card";

export default function MyRequestsScreen() {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyRequests(fetchWithAuth);
      const data = await res.json();

      if (data.success) {
        setRequests(data.data);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not load your requests");
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Request?", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setRequests((prev) => prev.filter((r) => r._id !== id));
            await deleteRequest(fetchWithAuth, id);
          } catch (error) {
            Alert.alert("Error", "Could not delete request");
            loadData();
          }
        }
      }
    ]);
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: "active" | "fulfilled"
  ) => {
    try {
      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );

      const res = await updateRequestStatus(fetchWithAuth, id, newStatus);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server Error:", res.status, errorText);
        throw new Error("Server rejected update");
      }
      const data = await res.json();

      if (!data.success) {
        throw new Error("Failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not update status");
      loadData(); // Revert
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Requests</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ManageRequestCard
                item={item}
                onDelete={handleDelete}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="documents-outline" size={64} color="#ddd" />
                <Text style={styles.emptyText}>
                  You haven&#39;t posted any requests.
                </Text>
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={() => router.push("/(tabs)/blood-request")}
                >
                  <Text style={styles.createBtnText}>Create New Request</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
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
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f9f9f9"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textMain
  },
  listContent: {
    padding: 20,
    paddingBottom: 40
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
    marginVertical: 16
  },
  createBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 20
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "600"
  }
});
