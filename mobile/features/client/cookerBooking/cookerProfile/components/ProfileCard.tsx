import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/styles";
import type { CookerProfile } from "../types";
import { Button } from "@/components/ui/Button";

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
        {cook.speciality}
      </Text>

      <Text style={styles.rate} testID="profile-rate">
        {hourlyRateLabel}
      </Text>

      {cook.description ? (
        <Text style={styles.description} testID="profile-description">
          {cook.description}
        </Text>
      ) : null}
      <Button title="Proposer un créneau" onPress={onProposeCreneau} testID="propose-creneau-button" />
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
});
