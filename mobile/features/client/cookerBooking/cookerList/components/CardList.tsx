import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/colors";
import { CookerCard, SPECIALITY_LABEL } from "./Card";
import { useCookerList } from "../useCookerList";
import type { CookerCardData, CookSpeciality } from "../types";

const ALL_SPECIALITIES = Object.keys(SPECIALITY_LABEL) as CookSpeciality[];

export const CookerList = () => {
  const { cooks, loading, error } = useCookerList();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] =
    useState<CookSpeciality | null>(null);

  const filtered = useMemo(() => {
    let result = cooks;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          c.last_name.toLowerCase().includes(q) ||
          `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      );
    }

    if (selectedSpeciality) {
      result = result.filter((c) => c.speciality === selectedSpeciality);
    }

    return result;
  }, [cooks, search, selectedSpeciality]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size="large"
          color={colors.main}
          testID="loading-indicator"
        />
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

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom ou ville..."
        placeholderTextColor={colors.text + "80"}
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        testID="search-input"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersContainer}
      >
        <TouchableOpacity
          style={[styles.chip, !selectedSpeciality && styles.chipActive]}
          onPress={() => setSelectedSpeciality(null)}
          testID="speciality-chip-all"
        >
          <Text
            style={[
              styles.chipText,
              !selectedSpeciality && styles.chipTextActive,
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>

        {ALL_SPECIALITIES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, selectedSpeciality === s && styles.chipActive]}
            onPress={() =>
              setSelectedSpeciality(selectedSpeciality === s ? null : s)
            }
            testID={`speciality-chip-${s}`}
          >
            <Text
              style={[
                styles.chipText,
                selectedSpeciality === s && styles.chipTextActive,
              ]}
            >
              {SPECIALITY_LABEL[s]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText} testID="empty-message">
            Aucun cuisinier ne correspond à votre recherche.
          </Text>
        </View>
      ) : (
        <FlatList<CookerCardData>
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CookerCard
              cooker={item}
              onPress={() =>
                router.push(`/client/viewCook/profile/${item.id}`)
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          testID="cooker-list"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  filtersContainer: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 8,
  },
  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  chipActive: {
    backgroundColor: colors.main,
    borderColor: colors.main,
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: "600",
  },
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
