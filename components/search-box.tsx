import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SearchBoxProps {
  onSubmitSearch?: (text: string) => void;
}

export default function SearchBox({
  onSubmitSearch = () => {}
}: SearchBoxProps) {
  const [searchText, setSearchText] = useState<string>("");

  const handleSubmit = () => {
    onSubmitSearch(searchText);
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#FFFFFF" style={styles.icon} />
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search..."
        placeholderTextColor="#B0B0B0"
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A33",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#444548",
    paddingHorizontal: 12,
    height: 44
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    color: "#DFDFE1",
    fontSize: 14
  }
});
