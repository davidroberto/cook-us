import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/styles/colors";
import type { CookerCardData } from "../types";

interface CookerCardProps {
  cooker: CookerCardData;
  onPress: () => void;
}

export const SPECIALITY_LABEL: Record<CookerCardData["speciality"], string> = {
  french_cooking: "Cuisine française",
  italian_cooking: "Cuisine italienne",
  asian_cooking: "Cuisine asiatique",
  mexican_cooking: "Cuisine mexicaine",
  vegetarian_cooking: "Cuisine végétarienne",
  pastry_cooking: "Pâtisserie & Desserts",
  japanese_cooking: "Cuisine japonaise",
  indian_cooking: "Cuisine indienne",
  autre: "Autre",
};

export const CookerCard = ({ cooker, onPress }: CookerCardProps) => {
  return (
    <TouchableOpacity style={styles.card} testID="cooker-card" onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {cooker.thumbnail ? (
          <Image
            source={{ uri: cooker.thumbnail }}
            style={styles.avatar}
            accessibilityLabel={`Photo de ${cooker.first_name} ${cooker.last_name}`}
            testID="cooker-thumbnail"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitials}>
              {cooker.first_name[0]}
              {cooker.last_name[0]}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} testID="cooker-name">
          {`${cooker.first_name} ${cooker.last_name}`}
        </Text>

        <Text style={styles.speciality} testID="cooker-speciality">
          {SPECIALITY_LABEL[cooker.speciality]}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.city} testID="cooker-city">
            {cooker.city}
          </Text>
          <Text style={styles.rate} testID="cooker-rate">
            {`${cooker.hourly_rate} €/h`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: colors.opacity[8],
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    backgroundColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.mainDark,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  speciality: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.main,
    marginBottom: 6,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  city: {
    fontSize: 13,
    color: colors.text,
    opacity: colors.opacity[56],
  },
  rate: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainDark,
  },
});
