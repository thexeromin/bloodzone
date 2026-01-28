import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ThemeColors } from "@/constants";
import UserDetailsForm from "@/components/user-details-form";

export default function EditProfile() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Edit Profile",
          headerStyle: { backgroundColor: ThemeColors.screenBackground },
          headerTintColor: ThemeColors.primaryContent,
          headerShadowVisible: false
        }}
      />

      <UserDetailsForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.screenBackground
  }
});
