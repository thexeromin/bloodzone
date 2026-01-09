import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ImageSourcePropType
} from "react-native";
import { ThemeColors } from "@/constants";

export interface Props {
  id: string;
  image: ImageSourcePropType;
  bloodNeed: string;
  address: string;
  onSendMessage?: (id: string) => void;
}

export default function Recipient({
  id,
  image,
  bloodNeed,
  address,
  onSendMessage
}: Props) {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image source={image} style={styles.avatar} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{bloodNeed}</Text>

        <Text style={styles.address}>{address}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onSendMessage?.(id)}
        >
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: ThemeColors.surfaceBackground,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: 18
  },
  avatar: {
    width: 80,
    height: 80,
    marginRight: 18,
    borderRadius: 50
  },
  content: {
    flex: 1
  },
  title: {
    marginBottom: 4,
    color: ThemeColors.primaryContent,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  address: {
    marginBottom: 8,
    color: ThemeColors.secondaryContent,
    fontSize: 14,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    })
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontFamily: Platform.select({
      android: "Poppins_400Regular",
      ios: "Poppins-Regular"
    }),
    backgroundColor: ThemeColors.accent,
    borderRadius: 8
  },
  buttonText: {
    color: "#171717",
    fontSize: 14,
    fontWeight: "500"
  }
});
