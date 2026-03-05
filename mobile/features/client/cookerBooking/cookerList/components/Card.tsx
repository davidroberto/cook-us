import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/colors";
import { Card } from "@/components/ui/Card";
import type { CookerCardData } from "../types";

interface CookerCardProps {
  cooker: CookerCardData;
  onPress: () => void;
}

export const SPECIALITY_LABEL: Record<string, string> = {
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

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const formatRate = (rate: unknown): string => {
  const num = Number(rate);
  if (!num || isNaN(num)) return "Tarif sur demande";
  return `${num % 1 === 0 ? num : num.toFixed(2)} €/h`;
};

export const CookerCard = ({ cooker, onPress }: CookerCardProps) => {
  const firstName = capitalize(cooker.first_name);
  const lastName = capitalize(cooker.last_name);
  return (
    <Card style={styles.cardLayout} testID="cooker-card" onPress={onPress}>
      <View style={styles.avatarContainer}>
        {cooker.thumbnail ? (
          <Image
            source={{ uri: cooker.thumbnail }}
            style={styles.avatar}
            accessibilityLabel={`Photo de ${firstName} ${lastName}`}
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
          {`${firstName} ${lastName}`}
        </Text>

        <Text style={styles.speciality} testID="cooker-speciality">
          {SPECIALITY_LABEL[cooker.speciality] ?? cooker.speciality}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.city} testID="cooker-city">
            {cooker.city}
          </Text>
          <Text style={styles.rate} testID="cooker-rate">
            {formatRate(cooker.hourly_rate)}
          </Text>
        </View>
        {cooker.averageRating !== null && (
          <Text style={styles.rating} testID="cooker-rating">
            ★ {cooker.averageRating.toFixed(1)}{" "}
            <Text style={styles.ratingCount}>({cooker.reviewCount})</Text>
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardLayout: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 6,
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
  rating: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: "700",
    marginTop: 2,
  },
  ratingCount: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "400",
    opacity: colors.opacity[56],
  },
  rate: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainDark,
  },
});
