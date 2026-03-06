import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/styles/colors";
import { CookerCard, SPECIALITY_LABEL } from "./Card";
import { useCookerList } from "../useCookerList";
import type { CookerCardData, CookSpeciality } from "../types";

const ALL_SPECIALITIES = Object.keys(SPECIALITY_LABEL) as CookSpeciality[];

export const CookerList = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList<CookerCardData>>(null);
  const scrollOffsetRef = useRef(0);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] =
    useState<CookSpeciality | null>(null);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Quand les filtres changent, la liste est rechargée depuis le début
  useEffect(() => {
    scrollOffsetRef.current = 0;
  }, [debouncedSearch, selectedSpeciality, minPriceInput, maxPriceInput]);

  const minHourlyRate = minPriceInput ? Number(minPriceInput) : undefined;
  const maxHourlyRate = maxPriceInput ? Number(maxPriceInput) : undefined;

  const { cooks, loading, loadingMore, error, refresh, loadMore } =
    useCookerList({
      search: debouncedSearch || undefined,
      speciality: selectedSpeciality ?? undefined,
      minHourlyRate,
      maxHourlyRate,
    });

  // Handle scroll with manual infinite scroll detection for RN Web
  const handleScroll = useCallback(
    (e: any) => {
      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
      scrollOffsetRef.current = contentOffset.y;

      // Check if we're near the bottom (within 30% of remaining content)
      const paddingToBottom = contentSize.height * 0.3;
      const isNearBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      if (isNearBottom && !loading && !loadingMore) {
        loadMore();
      }
    },
    [loadMore, loading, loadingMore],
  );

  // Restaure la position de scroll au retour depuis un profil
  useFocusEffect(
    useCallback(() => {
      if (scrollOffsetRef.current > 0) {
        flatListRef.current?.scrollToOffset({
          offset: scrollOffsetRef.current,
          animated: false,
        });
      }
    }, []),
  );

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom ou ville..."
          placeholderTextColor={colors.text + "80"}
          value={searchInput}
          onChangeText={setSearchInput}
          autoCorrect={false}
          testID="search-input"
        />
        {searchInput.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchInput("")}
            style={styles.clearButton}
            testID="search-clear-btn"
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.text + "80"}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.priceRow}>
        <TextInput
          testID="price-min-input"
          style={styles.priceInput}
          placeholder="Prix min"
          placeholderTextColor={colors.text + "80"}
          value={minPriceInput}
          onChangeText={setMinPriceInput}
          keyboardType="numeric"
        />
        <Text style={styles.priceSeparator}>—</Text>
        <TextInput
          testID="price-max-input"
          style={styles.priceInput}
          placeholder="Prix max"
          placeholderTextColor={colors.text + "80"}
          value={maxPriceInput}
          onChangeText={setMaxPriceInput}
          keyboardType="numeric"
        />
        <Text style={styles.priceUnit}>€/h</Text>
      </View>

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

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator
            size="large"
            color={colors.main}
            testID="loading-indicator"
          />
        </View>
      ) : cooks.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText} testID="empty-message">
            Aucun cuisinier ne correspond à votre recherche.
          </Text>
        </View>
      ) : (
        <FlatList<CookerCardData>
          ref={flatListRef}
          data={cooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CookerCard
              cooker={item}
              onPress={() => router.push(`/client/viewCook/profile/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          testID="cooker-list"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                testID="loading-more-indicator"
                size="small"
                color={colors.main}
                style={styles.footerLoader}
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  priceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  priceInput: {
    minWidth: 80,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  priceSeparator: {
    color: colors.text,
    opacity: 0.5,
  },
  priceUnit: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
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
  footerLoader: {
    paddingVertical: 16,
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
