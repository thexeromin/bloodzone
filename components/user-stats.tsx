import { View, Platform, StyleSheet, Text } from "react-native";

export default function UserStats() {
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Text style={styles.donationsValue}>100</Text>
        <Text style={styles.donationsLabel}>Donations</Text>
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.box}>
          <Text style={styles.boxText}>O+</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxText}>Last Donated</Text>
          <Text style={styles.boxText}>{20} days ago</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 170,
    gap: 10,
    marginTop: 30
  },
  leftColumn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#2A2A33",
    borderWidth: 1,
    borderColor: "#444548",
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

    backgroundColor: "#2A2A33",
    borderWidth: 1,
    borderColor: "#444548",
    borderRadius: 18
  },
  donationsLabel: {
    fontSize: 18,
    color: "#F5F3F4",
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  donationsValue: {
    fontSize: 44,
    color: "#FFFFFF",
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  boxText: {
    color: "#FFFFFF",
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  }
});
