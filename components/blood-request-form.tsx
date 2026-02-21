import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { useLocation } from "@/hooks";
import { createBloodRequest } from "@/services";
import { Colors } from "@/constants";

const requestSchema = z.object({
  bloodType: z.string().min(1, "Blood Type is required"),
  address: z.string().min(3, "Address is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be a valid 10-digit number"),
  neededBy: z.date(),
  latitude: z.number({ error: () => ({ message: "Location is required" }) }),
  longitude: z.number({ error: () => ({ message: "Location is required" }) })
});

type RequestFormValues = z.infer<typeof requestSchema>;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodRequestForm() {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { fetchWithAuth } = useAuth();
  const {
    location,
    address,
    errorMsg,
    loading: locLoading,
    refreshLocation
  } = useLocation();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      bloodType: "A+",
      address: "",
      phone: "",
      neededBy: new Date(),
      latitude: undefined,
      longitude: undefined
    }
  });

  const selectedDate = watch("neededBy");
  const lat = watch("latitude");

  // Auto-fill location
  useEffect(() => {
    if (location?.coords) {
      setValue("latitude", location.coords.latitude, { shouldValidate: true });
      setValue("longitude", location.coords.longitude, {
        shouldValidate: true
      });
    }

    // Auto-fill address if empty
    if (address?.formattedAddress && !getValues("address")) {
      setValue("address", address.formattedAddress, { shouldValidate: true });
    }

    if (errorMsg) {
      Alert.alert("Location Error", errorMsg);
    }
  }, [location, address, errorMsg, setValue, getValues]);

  const onSubmit = async (data: RequestFormValues) => {
    try {
      const response = await createBloodRequest<RequestFormValues>(
        fetchWithAuth,
        data
      );
      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Request posted successfully!", [
          { text: "OK" }
        ]);
        reset({
          bloodType: "A+",
          address: address?.formattedAddress || "",
          phone: "",
          neededBy: new Date(),
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude
        });
      } else {
        Alert.alert("Error", result.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Check your connection");
    }
  };

  return (
    <View style={styles.form}>
      {/* Blood group picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Blood Group</Text>
        <View style={styles.pickerWrapper}>
          <Controller
            control={control}
            name="bloodType"
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                mode="dropdown"
                style={styles.picker}
                dropdownIconColor={Colors.textSub}
              >
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
        {errors.bloodType && (
          <Text style={styles.errorText}>{errors.bloodType.message}</Text>
        )}
      </View>

      {/* Location status indicator */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location Status</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[
              styles.locationBadge,
              { flex: 1 },
              lat
                ? styles.locSuccess
                : locLoading
                  ? styles.locLoading
                  : styles.locError
            ]}
          >
            {locLoading ? (
              <ActivityIndicator
                size="small"
                color={Colors.warning}
                style={{ marginRight: 8 }}
              />
            ) : (
              <Ionicons
                name={lat ? "checkmark-circle" : "alert-circle"}
                size={20}
                color={lat ? Colors.success : Colors.error}
                style={{ marginRight: 8 }}
              />
            )}
            <Text
              style={[
                styles.locationText,
                lat
                  ? { color: Colors.success }
                  : locLoading
                    ? { color: Colors.warning }
                    : { color: Colors.error }
              ]}
            >
              {locLoading
                ? "Detecting Location..."
                : lat
                  ? "Location Attached"
                  : "Location Not Found"}
            </Text>
          </View>

          {!lat && !locLoading && (
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={refreshLocation}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {errors.latitude && (
          <Text style={styles.errorText}>GPS Location is required.</Text>
        )}
      </View>

      {/* Address input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hospital / Address</Text>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              placeholder="e.g. Apollo Hospital"
              placeholderTextColor={Colors.textMuted}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address.message}</Text>
        )}
      </View>

      {/* Phone input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contact Phone</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="10-digit mobile number"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}
      </View>

      {/* Date picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Needed By</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={[styles.input, { justifyContent: "center" }]}>
            <Text style={{ color: Colors.textMain, fontSize: 15 }}>
              {selectedDate ? selectedDate.toDateString() : "Select Date"}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors.textMuted}
              style={{ position: "absolute", right: 15 }}
            />
          </View>
        </TouchableOpacity>
        {errors.neededBy && (
          <Text style={styles.errorText}>{errors.neededBy.message}</Text>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            minimumDate={new Date()}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setValue("neededBy", date, { shouldValidate: true });
            }}
          />
        )}
      </View>

      {/* Submit button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.9}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Post Request</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    paddingVertical: 10
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textMain,
    marginBottom: 8,
    marginLeft: 4
  },

  // Input Style
  input: {
    height: 56,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.textMain
  },
  inputError: {
    borderColor: Colors.error
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4
  },

  // Picker Style
  pickerWrapper: {
    height: 56,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    justifyContent: "center",
    paddingLeft: Platform.OS === "android" ? 12 : 0,
    overflow: "hidden"
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
    color: Colors.textMain,
    height: 56
  },

  // Location badge styles
  locationBadge: {
    height: 50,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1
  },
  locLoading: {
    backgroundColor: Colors.warningBg,
    borderColor: Colors.warningBg
  },
  locSuccess: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.successBg
  },
  locError: {
    backgroundColor: Colors.errorBg,
    borderColor: Colors.errorBg
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600"
  },
  // 4. Styles for the new refresh button
  refreshButton: {
    height: 50,
    width: 50,
    backgroundColor: Colors.error, // Or a secondary brand color
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },

  // Submit button
  submitButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  submitButtonDisabled: {
    opacity: 0.7
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
