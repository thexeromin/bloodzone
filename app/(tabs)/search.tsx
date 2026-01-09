import { View, StyleSheet } from "react-native";
import { ThemeColors } from "@/constants";

import SearchBox from "@/components/search-box";
import Recipients from "@/components/recipients";

export default function Search() {
  const handleSearch = (text: string) => {
    alert("Seraching ... " + text);
  };

  return (
    <View style={styles.container}>
      <SearchBox onSubmitSearch={handleSearch} />

      <Recipients title="Search Results" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 20,
    backgroundColor: ThemeColors.screenBackground
  }
});
