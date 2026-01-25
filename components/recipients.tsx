import { useState, useEffect } from "react";
import {
  Alert,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList
} from "react-native";
import { ThemeColors } from "@/constants";
import { useAuth } from "@/context";
import { getBloodRequests } from "@/services";

import Recipient from "./recipient";

interface Props {
  title: string;
}

interface FeedItem {
  id: string;
  image: string;
  bloodNeed: string;
  address: string;
}

export default function Recipients({ title }: Props) {
  const { fetchWithAuth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState<FeedItem[]>([]);

  // TODO: implement messaging
  const handleSendMessage = (id: string) => {
    alert(`Send message to recipient ${id}`);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getBloodRequests(fetchWithAuth);
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const formattedData: FeedItem[] = result.data.map((item: any) => ({
            id: item._id,
            image: item.user?.avatar || "",
            bloodNeed: item.bloodType,
            address: `${item.location}, ${item.city}`
          }));

          setRecipients(formattedData);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [fetchWithAuth]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>

      <View style={styles.divider} />

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
  }
});
