import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, ThemeColors } from "@/constants";

interface Props {
  onSignOut: () => void;
}

export default function UserDetailsForm({ onSignOut }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Blood Type (e.g. O+)"
        placeholderTextColor={ThemeColors.placeholder}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Location"
          placeholderTextColor={ThemeColors.placeholder}
        />
        <TouchableOpacity style={styles.circleButton}>
          <MaterialIcons
            name="my-location"
            size={20}
            color={Colors.neutral100}
          />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.actionButton, styles.saveButton]}>
          <Text style={styles.saveButtonText}>Save Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={onSignOut}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%"
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: ThemeColors.surfaceBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    color: ThemeColors.secondaryContent,
    marginBottom: 15,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: ThemeColors.surfaceBackground,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 12
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  },
  saveButton: {
    backgroundColor: ThemeColors.accent
  },
  logoutButton: {
    backgroundColor: ThemeColors.dangerSecondary
  },
  saveButtonText: {
    color: Colors.neutral900,
    fontSize: 16,
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  logoutButtonText: {
    color: ThemeColors.primaryContent,
    fontSize: 16,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  }
});
