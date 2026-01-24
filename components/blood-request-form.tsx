import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/context";
import { createBloodRequest } from "@/services";
import { ThemeColors, Colors } from "@/constants";

const requestSchema = z.object({
  bloodType: z.string().min(1, "Blood Type is required"),
  location: z.string().min(3, "Location must be at least 3 chars"),
  city: z.string().min(2, "City is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be a valid 10-digit number"),
  neededBy: z.date()
});

type RequestFormValues = z.infer<typeof requestSchema>;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodRequestForm() {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { fetchWithAuth } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      bloodType: "A+",
      location: "",
      city: "",
      phone: "",
      neededBy: new Date()
    }
  });

  // Watch the date value to display it in the text box
  const selectedDate = watch("neededBy");

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
        reset();
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
      {/* Blood Type Picker */}
      <Text style={styles.label}>Blood Group</Text>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="bloodType"
          render={({ field: { onChange, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              // Fixes for visibility:
              dropdownIconColor="#333" // Forces the arrow to be dark
              mode="dropdown" // Android: looks cleaner
              style={styles.picker}
              // iOS specific text color fix:
              itemStyle={{ color: ThemeColors.secondaryContent }}
            >
              {BLOOD_GROUPS.map((bg) => (
                <Picker.Item key={bg} label={bg} value={bg} />
              ))}
            </Picker>
          )}
        />
      </View>
      {errors.bloodType && (
        <Text style={styles.errorText}>{errors.bloodType.message}</Text>
      )}

      {/* Location */}
      <Text style={styles.label}>Location (Hospital/Area)</Text>
      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.location && styles.inputError]}
            placeholder="e.g. Apollo Hospital, Room 204"
            placeholderTextColor={ThemeColors.placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.location && (
        <Text style={styles.errorText}>{errors.location.message}</Text>
      )}

      {/* City */}
      <Text style={styles.label}>City</Text>
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.city && styles.inputError]}
            placeholder="e.g. Mumbai"
            placeholderTextColor={ThemeColors.placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.city && (
        <Text style={styles.errorText}>{errors.city.message}</Text>
      )}

      {/* Phone */}
      <Text style={styles.label}>Contact Phone</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="10-digit mobile number"
            placeholderTextColor={ThemeColors.placeholder}
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

      {/* Date Picker */}
      <Text style={styles.label}>Needed By</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowDatePicker(true)}
      >
        <View style={[styles.input, { justifyContent: "center" }]}>
          <Text style={{ color: ThemeColors.primaryContent }}>
            {selectedDate ? selectedDate.toDateString() : "Select Date"}
          </Text>
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
            if (date) {
              setValue("neededBy", date, { shouldValidate: true });
            }
          }}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Posting..." : "Post Request"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%"
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: ThemeColors.secondaryContent,
    marginBottom: 8,
    marginLeft: 5,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
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
  inputError: {
    borderColor: ThemeColors.dangerPrimary
  },
  // Wrapper for Picker to match Input look
  inputWrapper: {
    height: 50,
    borderWidth: 1,
    borderColor: ThemeColors.surfaceBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15
  },
  picker: {
    width: "100%",
    color: ThemeColors.secondaryContent,
    marginLeft: Platform.OS === "android" ? 10 : 0
  },
  errorText: {
    color: ThemeColors.dangerPrimary,
    fontSize: 12,
    marginTop: -5,
    marginBottom: 15,
    marginLeft: 15,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  // Submit Button Styles
  submitButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: ThemeColors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4
  },
  submitButtonDisabled: {
    backgroundColor: "#ff8a80",
    elevation: 0
  },
  submitButtonText: {
    color: Colors.neutral900,
    fontSize: 16,
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  }
});
