import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/colors";
import { CookerCard } from "./Card";
import { useCookerList } from "../useCookerList";
import type { CookerCardData } from "../types";

export const CookerList = () => {
  const { cooks, loading, error } = useCookerList();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.main} testID="loading-indicator" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText} testID="error-message">
          {error}
        </Text>
      </View>
    );
  }

  if (cooks.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText} testID="empty-message">
          Aucun cuisinier disponible pour le moment.
        </Text>
      </View>
    );
  }

  return (
    <FlatList<CookerCardData>
      data={cooks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CookerCard cooker={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      testID="cooker-list"
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: colors.mainDark,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: colors.text,
    textAlign: "center",
  },
});
