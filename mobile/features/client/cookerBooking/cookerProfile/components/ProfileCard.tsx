import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/styles";
import type { CookerProfile } from "../types";
import { Button } from "@/components/ui/Button";

const NUM_COLUMNS = 2;
const GRID_GAP = 12;
const screenWidth = Dimensions.get("window").width;
const IMAGE_SIZE = (screenWidth - 48 - GRID_GAP) / NUM_COLUMNS;

const SPECIALITY_LABEL: Record<string, string> = {
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

interface ProfileCardProps {
  cook: CookerProfile;
  onProposeCreneau: () => void;
}

export const ProfileCard = ({ cook, onProposeCreneau }: ProfileCardProps) => {
  const hourlyRateLabel =
    cook.hourlyRate != null ? `${cook.hourlyRate}€/h` : "Tarif sur demande";

  return (
    <View style={styles.container} testID="profile-card">
      <ProfileAvatar
        photoUrl={cook.photoUrl}
        firstName={cook.firstName}
        lastName={cook.lastName}
      />

      <Text style={styles.name} testID="profile-name">
        {cook.firstName} {cook.lastName}
      </Text>

      <Text style={styles.speciality} testID="profile-speciality">
        {SPECIALITY_LABEL[cook.speciality] ?? cook.speciality}
      </Text>

      <Text style={styles.rate} testID="profile-rate">
        {hourlyRateLabel}
      </Text>

      {cook.averageRating !== null && (
        <View style={styles.ratingRow} testID="profile-average-rating">
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingValue}>{cook.averageRating.toFixed(1)}</Text>
          <Text style={styles.ratingCount}>({cook.reviews.length} avis)</Text>
        </View>
      )}

      {cook.description ? (
        <Text style={styles.description} testID="profile-description">
          {cook.description}
        </Text>
      ) : null}

      <Button title="Proposer un créneau" onPress={onProposeCreneau} testID="propose-creneau-button" />

      {cook.images.length > 0 && (
        <View style={styles.gallerySection} testID="profile-gallery">
          <Text style={styles.galleryTitle}>Ses plats</Text>
          <View style={styles.galleryGrid}>
            {cook.images.map((img) => (
              <View key={img.id} style={styles.galleryCard}>
                <Image
                  source={{ uri: img.url }}
                  style={styles.galleryImage}
                  testID={`gallery-image-${img.id}`}
                />
                {img.description && (
                  <View style={styles.captionOverlay}>
                    <Text style={styles.captionText} numberOfLines={2}>
                      {img.description}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {cook.reviews.length > 0 && (
        <View style={styles.reviewsSection} testID="profile-reviews">
          <Text style={styles.reviewsTitle}>Avis clients</Text>
          {cook.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard} testID="profile-review-item">
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.clientFirstName}</Text>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Text
                      key={s}
                      style={[styles.reviewStar, s <= review.rating && styles.reviewStarFilled]}
                    >
                      ★
                    </Text>
                  ))}
                </View>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
              {review.comment ? (
                <Text style={styles.reviewComment}>{review.comment}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

function ProfileAvatar({
  photoUrl,
  firstName,
  lastName,
}: {
  photoUrl: string | null;
  firstName: string;
  lastName: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (photoUrl && !hasError) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={styles.avatar}
        accessibilityLabel={`Photo de ${firstName} ${lastName}`}
        onError={() => setHasError(true)}
        testID="profile-avatar"
      />
    );
  }

  return (
    <View
      style={[styles.avatar, styles.avatarFallback]}
      testID="profile-avatar-fallback"
    >
      <Text style={styles.avatarInitials}>
        {firstName[0]}
        {lastName[0]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 24,
    gap: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  avatarFallback: {
    backgroundColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    ...typography.styles.heading1,
    color: colors.mainDark,
  },
  name: {
    ...typography.styles.heading1,
    color: colors.text,
  },
  speciality: {
    ...typography.styles.body1Regular,
    color: colors.text,
    opacity: colors.opacity[56],
  },
  rate: {
    ...typography.styles.body1Bold,
    color: colors.main,
  },
  description: {
    ...typography.styles.body2Regular,
    color: colors.text,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 320,
    opacity: colors.opacity[80],
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: colors.main,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
  },
  primaryButtonText: {
    ...typography.styles.body1Bold,
    color: colors.white,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingStar: {
    fontSize: 18,
    color: colors.secondary,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  ratingCount: {
    fontSize: 13,
    color: colors.text,
    opacity: colors.opacity[56],
  },
  reviewsSection: {
    width: "100%",
    marginTop: 24,
    alignItems: "flex-start",
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  reviewCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  reviewStars: {
    flexDirection: "row",
    gap: 1,
  },
  reviewStar: {
    fontSize: 13,
    color: colors.tertiary,
  },
  reviewStarFilled: {
    color: colors.secondary,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.text,
    opacity: colors.opacity[40],
    marginLeft: "auto",
  },
  reviewComment: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    opacity: colors.opacity[80],
  },
  gallerySection: {
    width: "100%",
    marginTop: 28,
  },
  galleryTitle: {
    ...typography.styles.body1Bold,
    color: colors.text,
    marginBottom: 16,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  galleryCard: {
    width: IMAGE_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  galleryImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  captionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  captionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
});
