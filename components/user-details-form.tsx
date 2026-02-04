import { useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Colors } from "@/constants";
import { useLocation } from "@/hooks";
import { profileSetup } from "@/services";
import { useAuth } from "@/context";

const profileSchema = z.object({
  bloodGroup: z.string().min(1, "Blood Group is required"),
  address: z.string().min(3, "Location is required")
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Props {
  onSignOut?: () => void;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function UserDetailsForm({ onSignOut }: Props) {
  const { fetchWithAuth, handleProfileComplete, user, refreshSession } =
    useAuth();
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
      Alert.alert(
        "Location Missing",
        "Please wait for GPS to fetch your location."
      );
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
      console.log(response);
      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        await refreshSession();
        handleProfileComplete(true);
      } else {
        Alert.alert("Error", "Could not save profile details.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network request failed.");
    }
  };

  if (locLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Detecting your location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={24} color={Colors.error} />
          <Text style={styles.errorMsgText}>{errorMsg}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Blood group picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Blood Group</Text>

        <View style={styles.pickerWrapper}>
          <Controller
            control={control}
            name="bloodGroup"
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
                mode="dropdown"
                dropdownIconColor={Colors.textSub}
              >
                <Picker.Item
                  label="Select your type"
                  value=""
                  color={Colors.textMuted}
                  style={{ backgroundColor: "#ffffff" }}
                />
                {BLOOD_GROUPS.map((bg) => (
                  <Picker.Item
                    key={bg}
                    label={bg}
                    value={bg}
                    color={Colors.textMain}
                    style={{ backgroundColor: "#ffffff" }}
                  />
                ))}
              </Picker>
            )}
          />
        </View>
        {errors.bloodGroup && (
          <Text style={styles.fieldError}>{errors.bloodGroup.message}</Text>
        )}
      </View>

      {/* Location input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.locationRow}>
          <View style={styles.locationInputWrapper}>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Fetching address..."
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor={Colors.textMuted}
                  editable={false}
                  multiline={false}
                />
              )}
            />
          </View>
          <View style={styles.gpsButton}>
            <Ionicons name="location-sharp" size={20} color={Colors.primary} />
          </View>
        </View>
        {errors.address && (
          <Text style={styles.fieldError}>{errors.address.message}</Text>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.btn,
            styles.saveBtn,
            isSubmitting && styles.btnDisabled
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Profile</Text>
          )}
        </TouchableOpacity>

        {onSignOut && (
          <TouchableOpacity
            style={[styles.btn, styles.logoutBtn]}
            onPress={onSignOut}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 10, width: "100%" },

  // States
  loadingContainer: { padding: 40, alignItems: "center" },
  loadingText: { marginTop: 15, color: Colors.textSub, fontSize: 14 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.errorBg,
    padding: 16,
    borderRadius: 16
  },
  errorMsgText: { color: Colors.error, marginLeft: 10, fontSize: 14, flex: 1 },

  // Inputs
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textMain,
    marginBottom: 8,
    marginLeft: 4
  },
  fieldError: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4
  },

  // Picker styles
  pickerWrapper: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    // Creates the left padding on Android
    paddingLeft: Platform.OS === "android" ? 12 : 0,
    overflow: "hidden"
  },
  picker: {
    width: "100%",
    backgroundColor: "#ffffff",
    color: Colors.textMain,
    height: 56
  },

  // Location
  locationRow: { flexDirection: "row", alignItems: "center" },
  locationInputWrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 56,
    justifyContent: "center"
  },
  input: {
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.textMain,
    height: "100%"
  },
  gpsButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    borderWidth: 1,
    borderColor: "rgba(211, 47, 47, 0.1)"
  },

  // Buttons
  buttonContainer: { marginTop: 10, gap: 16 },
  btn: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center"
  },
  btnDisabled: { opacity: 0.7 },
  saveBtn: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  logoutBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.border
  },
  logoutBtnText: { color: Colors.error, fontSize: 16, fontWeight: "600" }
});
