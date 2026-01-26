import React, { useEffect } from "react";
import {
  ActivityIndicator,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Colors, ThemeColors } from "@/constants";
import { useLocation } from "@/hooks";
import { profileSetup } from "@/services";
import { useAuth } from "@/context";

const profileSchema = z.object({
  bloodGroup: z.string().min(1, "Blood Group is required"),
  address: z.string().min(3, "Location is required")
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Props {
  onSignOut: () => void;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function UserDetailsForm({ onSignOut }: Props) {
  const { fetchWithAuth, handleProfileComplete, user } = useAuth();
  const { location, address, errorMsg, loading: locLoading } = useLocation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bloodGroup: user?.bloodGroup || "",
      address: ""
    }
  });

  useEffect(() => {
    if (address?.formattedAddress) {
      setValue("address", address.formattedAddress, { shouldValidate: true });
    }
  }, [address, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!location?.coords) {
      Alert.alert("Error", "GPS location missing. Please wait or enable GPS.");
      return;
    }

    try {
      const payload = {
        bloodGroup: data.bloodGroup,
        address: data.address,
        location: {
          lat: location.coords.latitude.toString(),
          lon: location.coords.longitude.toString()
        }
      };

      const response = await profileSetup(fetchWithAuth, payload);

      if (response.status === 200) {
        Alert.alert("Success", "Profile setup complete!");
        handleProfileComplete(true);
      } else {
        Alert.alert("Error", "Something went wrong with server call");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  if (locLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ThemeColors.accent} />
        <Text
          style={{
            color: ThemeColors.secondaryContent,
            marginTop: 10,
            textAlign: "center"
          }}
        >
          Fetching your location...
        </Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Blood Type Picker */}
      <View style={styles.pickerContainer}>
        <Controller
          control={control}
          name="bloodGroup"
          render={({ field: { onChange, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
              dropdownIconColor={ThemeColors.secondaryContent}
              itemStyle={{ color: ThemeColors.secondaryContent }} // iOS
            >
              <Picker.Item
                label="Select Blood Type"
                value=""
                color={ThemeColors.placeholder}
              />
              {BLOOD_GROUPS.map((bg) => (
                <Picker.Item
                  key={bg}
                  label={bg}
                  value={bg}
                  color={ThemeColors.secondaryContent} // Android
                />
              ))}
            </Picker>
          )}
        />
      </View>
      {errors.bloodGroup && (
        <Text style={styles.errorText}>{errors.bloodGroup.message}</Text>
      )}

      {/* Location Input */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                placeholder="Location"
                value={value}
                onChangeText={onChange}
                placeholderTextColor={ThemeColors.placeholder}
                editable={false} // Usually locked if GPS provided
              />
            )}
          />
        </View>

        <TouchableOpacity style={styles.circleButton}>
          <MaterialIcons
            name="my-location"
            size={20}
            color={Colors.neutral100}
          />
        </TouchableOpacity>
      </View>
      {errors.address && (
        <Text style={styles.errorText}>{errors.address.message}</Text>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.saveButton,
            isSubmitting && { opacity: 0.7 }
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.neutral900} />
          ) : (
            <Text style={styles.saveButtonText}>Save Details</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={onSignOut}
          disabled={isSubmitting}
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
  // Wrapper for Picker to match input style
  pickerContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: ThemeColors.surfaceBackground,
    borderRadius: 25,
    marginBottom: 15,
    justifyContent: "center",
    overflow: "hidden"
  },
  picker: {
    width: "100%",
    color: ThemeColors.secondaryContent,
    marginLeft: Platform.OS === "android" ? 10 : 0
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
  },
  errorText: {
    color: ThemeColors.dangerSecondary,
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 15,
    marginTop: -10
  }
});
