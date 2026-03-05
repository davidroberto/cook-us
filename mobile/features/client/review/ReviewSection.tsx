import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/styles/colors";
import { useReview } from "@/features/client/review/useReview";
import type { OrderReview } from "@/features/client/account/viewProfile/useOrderHistory";

interface Props {
  cookRequestId: number;
  existingReview: OrderReview | null;
  cookName: string;
  onReviewSubmitted: () => void;
}

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={starStyles.row} testID="star-selector">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange(star)}
          testID={`star-${star}`}
        >
          <Text style={[starStyles.star, star <= value && starStyles.starFilled]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReadOnlyReview({ review }: { review: OrderReview }) {
  return (
    <View style={styles.readOnly} testID="review-readonly">
      <Text style={styles.sectionTitle}>Votre avis</Text>
      <View style={starStyles.row}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text
            key={star}
            style={[starStyles.star, star <= review.rating && starStyles.starFilled]}
          >
            ★
          </Text>
        ))}
      </View>
      {review.comment ? (
        <Text style={styles.readOnlyComment} testID="review-comment">
          {review.comment}
        </Text>
      ) : null}
    </View>
  );
}

export function ReviewSection({
  cookRequestId,
  existingReview,
  cookName,
  onReviewSubmitted,
}: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { submit, loading, error, submitted } = useReview(
    cookRequestId,
    onReviewSubmitted
  );

  if (submitted) {
    return (
      <View style={styles.confirmation} testID="review-confirmation">
        <Text style={styles.confirmationText}>
          Merci pour votre avis sur {cookName} !
        </Text>
      </View>
    );
  }

  if (existingReview) {
    return <ReadOnlyReview review={existingReview} />;
  }

  return (
    <View style={styles.form} testID="review-form">
      <Text style={styles.sectionTitle}>Noter la prestation</Text>
      <StarSelector value={rating} onChange={setRating} />

      <TextInput
        style={styles.commentInput}
        placeholder="Laissez un commentaire (optionnel)..."
        placeholderTextColor={colors.text + "80"}
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={3}
        testID="review-comment-input"
      />

      {error ? (
        <Text style={styles.error} testID="review-error">
          {error}
        </Text>
      ) : null}

      {loading ? (
        <ActivityIndicator color={colors.main} testID="review-loading" />
      ) : (
        <TouchableOpacity
          style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
          onPress={() => rating > 0 && submit(rating, comment)}
          disabled={rating === 0}
          accessibilityRole="button"
          testID="review-submit"
        >
          <Text style={styles.submitBtnText}>Envoyer l'avis</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 12,
  },
  star: {
    fontSize: 28,
    color: colors.tertiary,
  },
  starFilled: {
    color: colors.secondary,
  },
});

const styles = StyleSheet.create({
  form: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
  },
  readOnly: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.main,
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: colors.text,
    minHeight: 72,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  error: {
    color: colors.mainDark,
    fontSize: 13,
    marginBottom: 8,
  },
  submitBtn: {
    backgroundColor: colors.main,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: colors.tertiary,
  },
  submitBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  readOnlyComment: {
    fontSize: 14,
    color: colors.text,
    fontStyle: "italic",
    lineHeight: 20,
  },
  confirmation: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
    alignItems: "center",
  },
  confirmationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    textAlign: "center",
  },
});
