import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColors } from "@/constants";

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
      <Ionicons
        name="search"
        size={18}
        color={ThemeColors.primaryContent}
        style={styles.icon}
      />
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search..."
        placeholderTextColor={ThemeColors.placeholder}
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
    backgroundColor: ThemeColors.surfaceBackground,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingHorizontal: 12,
    height: 44
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    color: ThemeColors.secondaryContent,
    fontSize: 14
  }
});
