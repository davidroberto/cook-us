import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/colors";
import type { CookerCardData } from "../types";

interface CookerCardProps {
  cooker: CookerCardData;
}

const SPECIALITY_LABEL: Record<CookerCardData["speciality"], string> = {
  indian: "Cuisine indienne",
  french: "Cuisine française",
  italian: "Cuisine italienne",
  japanese: "Cuisine japonaise",
  mexican: "Cuisine mexicaine",
};

export const CookerCard = ({ cooker }: CookerCardProps) => {
  return (
    <View style={styles.card} testID="cooker-card">
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
    </View>
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
