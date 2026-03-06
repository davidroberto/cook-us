import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/colors";
import { CancelBookingButton } from "@/features/client/cancelBooking/components/CancelBookingButton";
import { ReviewSection } from "@/features/client/review/ReviewSection";
import type { OrderReview } from "@/features/client/account/viewProfile/useOrderHistory";

export type CookRequestCardStatus =
  | "pending"
  | "accepted"
  | "refused"
  | "cancelled"
  | "paid"
  | "completed";

const STATUS_LABEL: Record<CookRequestCardStatus, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  cancelled: "Annulée",
  paid: "Payée",
  completed: "Terminée",
};

const STATUS_COLOR: Record<CookRequestCardStatus, string> = {
  pending: colors.secondary,
  accepted: "#4CAF50",
  refused: colors.mainDark,
  cancelled: "#9E9E9E",
  paid: "#2E7D32",
  completed: "#607D8B",
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
};

type Props = {
  id: number;
  startDate: string;
  status: CookRequestCardStatus;
  guestsNumber: number;
  mealType: string;
  cancellationReason?: string | null;
  cookName?: string;
  canCancel?: boolean;
  onCancelSuccess?: () => void;
  review?: OrderReview | null;
  onReviewSubmitted?: () => void;
  address?: string | null;
  beforeCancel?: ReactNode;
  children?: ReactNode;
};

export function CookRequestCard({
  id,
  startDate,
  status,
  guestsNumber,
  mealType,
  cancellationReason,
  cookName,
  canCancel,
  onCancelSuccess,
  review,
  onReviewSubmitted,
  address,
  beforeCancel,
  children,
}: Props) {
  const formattedDate = new Date(startDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statusColor = STATUS_COLOR[status] ?? "#9E9E9E";
  const statusLabel = STATUS_LABEL[status] ?? status;

  return (
    <View style={styles.card} testID="order-item">
      <View style={styles.cardHeader}>
        {cookName ? (
          <Text style={styles.cookName} testID="order-cook-name">
            {cookName}
          </Text>
        ) : (
          <View />
        )}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText} testID="order-status">
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.detail} testID="order-date">
          {formattedDate}
        </Text>
        <Text style={styles.detail} testID="order-guests">
          {guestsNumber} convive{guestsNumber > 1 ? "s" : ""}
        </Text>
      </View>

      <Text style={styles.detail} testID="order-meal-type">
        {MEAL_TYPE_LABELS[mealType] ?? mealType}
      </Text>

      {address ? <Text style={styles.address}>{address}</Text> : null}

      {cancellationReason ? (
        <Text style={styles.cancellationReason} testID="cancellation-reason">
          Motif : {cancellationReason}
        </Text>
      ) : null}

      {beforeCancel}

      {canCancel && onCancelSuccess && cookName ? (
        <CancelBookingButton
          requestId={id}
          cookName={cookName}
          onSuccess={onCancelSuccess}
        />
      ) : null}

      {status === "completed" && onReviewSubmitted ? (
        <ReviewSection
          cookRequestId={id}
          existingReview={review ?? null}
          cookName={cookName ?? ""}
          onReviewSubmitted={onReviewSubmitted}
        />
      ) : null}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: colors.opacity[8],
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cookName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detail: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  address: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
    marginTop: 6,
  },
  cancellationReason: {
    marginTop: 8,
    fontSize: 13,
    color: colors.mainDark,
    fontStyle: "italic",
  },
});
