import { View, Platform, StyleSheet, Text } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { ThemeColors } from "@/constants";

interface Props {
  donations: number;
  bloodType: string;
  lastDonated: number;
}

export default function UserStats({
  donations,
  bloodType,
  lastDonated
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Text style={styles.donationsValue}>{donations}</Text>
        <Text style={styles.donationsLabel}>Donations</Text>
      </View>

      <View style={styles.rightColumn}>
        <View style={[styles.box, styles.bloodInfoContainer]}>
          <Fontisto name="blood-drop" size={18} color="#FF4D4F" />
          <Text style={[styles.boxText, styles.bloodValue]}>{bloodType}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxText}>Last Donated</Text>
          <Text style={styles.boxText}>{lastDonated} days ago</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 170,
    marginTop: 30,
    flexDirection: "row",
    gap: 10
  },
  leftColumn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColors.surfaceBackground,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: 18
  },
  rightColumn: {
    flex: 1,
    gap: 10
  },
  box: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColors.surfaceBackground,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: 18
  },
  donationsLabel: {
    color: ThemeColors.secondaryContent,
    fontSize: 18,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  donationsValue: {
    color: ThemeColors.primaryContent,
    fontSize: 44,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  boxText: {
    color: ThemeColors.primaryContent,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  bloodInfoContainer: {
    flexDirection: "row"
  },
  bloodValue: {
    position: "relative",
    top: 2,
    marginLeft: 6,
    fontSize: 18,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  }
});
