import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ImageSourcePropType
} from "react-native";

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
    backgroundColor: "#2A2A33",
    borderWidth: 1,
    borderColor: "#444548",
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  address: {
    marginBottom: 8,
    color: "#DFDFE1",
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
    backgroundColor: "#CFEEF8",
    borderRadius: 8
  },
  buttonText: {
    color: "#171717",
    fontSize: 14,
    fontWeight: "500"
  }
});
