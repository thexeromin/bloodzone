import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context";
import { Colors } from "@/constants";
import UserStats from "@/components/user-stats";
import UrgentRequests from "@/components/urgent-requests";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const renderRequestItem = ({ item }: any) => (
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
        {item.hospital}
      </Text>
      <View style={styles.reqMeta}>
        <Ionicons name="location-outline" size={14} color={Colors.textSub} />
        <Text style={styles.reqDistance}>{item.distance} away</Text>
      </View>
      <TouchableOpacity style={styles.donateBtnSmall}>
        <Text style={styles.donateBtnText}>Donate</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Added edges={['top']} to remove bottom gap */}
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Image
                source={
                  user?.picture
                    ? { uri: user.picture }
                    : require("@/assets/images/avatar.jpg")
                }
                style={styles.avatar}
              />
              <View style={styles.activeDot} />
            </TouchableOpacity>
          </View>

          {/* User stats */}
          <UserStats />

          {/* Actions */}
          <Text style={styles.sectionTitle}>What would you like to do?</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.9}
              onPress={() => router.push("/find-donors")}
            >
              <View style={[styles.iconBox, { backgroundColor: "#FFEBEE" }]}>
                <Ionicons name="search" size={28} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Find Donors</Text>
                <Text style={styles.actionDesc}>
                  Request blood for a patient nearby.
                </Text>
              </View>
              <View style={styles.arrowCircle}>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.primary}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.9}
              onPress={() => router.push("/(tabs)/donate")}
            >
              <View style={[styles.iconBox, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="location" size={28} color={Colors.success} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Donate Now</Text>
                <Text style={styles.actionDesc}>
                  Locate blood drives & hospitals.
                </Text>
              </View>
              <View style={styles.arrowCircle}>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.success}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Urgent requests */}
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Urgent Requests</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <UrgentRequests />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background // Ensure this matches your palette
  },
  scrollContent: {
    paddingBottom: 110 // <--- INCREASED PADDING (prevents content hiding behind Tab Bar)
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 24
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textSub,
    marginBottom: 2
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textMain
  },
  profileButton: {
    position: "relative"
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.surface
  },
  activeDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: Colors.success,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.surface
  },

  // Main Actions
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textMain,
    marginLeft: 24,
    marginBottom: 15
  },
  actionGrid: {
    paddingHorizontal: 20,
    marginBottom: 30
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textMain,
    marginBottom: 4
  },
  actionDesc: {
    fontSize: 13,
    color: Colors.textSub,
    maxWidth: 200
  },
  arrowCircle: {
    marginLeft: "auto",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center"
  },

  // List Section
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 24,
    marginBottom: 10
  },
  seeAllText: {
    color: Colors.primary,
    fontWeight: "600"
  },
  reqCard: {
    backgroundColor: Colors.surface,
    width: 180,
    padding: 16,
    borderRadius: 20,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  reqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  bloodTag: {
    backgroundColor: Colors.primaryLight,
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
  donateBtnSmall: {
    backgroundColor: Colors.textMain,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center"
  },
  donateBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold"
  }
});
