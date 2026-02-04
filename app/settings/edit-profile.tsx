import { View, StyleSheet, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "@/constants";
import UserDetailsForm from "@/components/user-details-form";

export default function EditProfile() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <Stack.Screen
        options={{
          title: "Edit Profile",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textMain,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20
          }
        }}
      />

      <UserDetailsForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20 // Add padding so the form isn't stuck to edges
  }
});
