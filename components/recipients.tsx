import { View, Text, StyleSheet, Platform, FlatList } from "react-native";
import Recipient from "./recipient";

// TODO: delete this mock data
const recipientsData = [
  {
    id: "1",
    image: require("@/assets/images/avatar.jpg"),
    bloodNeed: "Need O+",
    address: "123 Main Street, New York"
  },
  {
    id: "2",
    image: require("@/assets/images/avatar.jpg"),
    bloodNeed: "Need A+",
    address: "45 Park Avenue, California"
  },
  {
    id: "3",
    image: require("@/assets/images/avatar.jpg"),
    bloodNeed: "Need B-",
    address: "78 Lake View Road, Chicago"
  },
  {
    id: "4",
    image: require("@/assets/images/avatar.jpg"),
    bloodNeed: "Need AB+",
    address: "12 Sunset Boulevard, Los Angeles"
  }
];

interface Props {
  title: string;
  // TODO: add recipients type of array
  recipients?: null;
}

export default function Recipients({ title }: Props) {
  const handleSendMessage = (id: string) => {
    alert(`Send message to recipient ${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>

      <View style={styles.divider} />

      {/* Recipients List */}
      <FlatList
        data={recipientsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Recipient {...item} onSendMessage={handleSendMessage} />
        )}
        contentContainerStyle={styles.recipientsContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingVertical: 16
  },
  heading: {
    marginBottom: 8,
    color: "#F5F3F4",
    fontSize: 20,
    fontFamily: Platform.select({
      android: "Poppins_500Medium",
      ios: "Poppins-Medium"
    })
  },
  divider: {
    width: "100%",
    height: 1,
    marginBottom: 16,
    backgroundColor: "#444548"
  },
  recipientsContainer: {
    gap: 12,
    paddingBottom: 16
  }
});
