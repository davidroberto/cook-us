import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "@/styles/colors";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { acceptRequest, refuseRequest } from "./repository";
import type { CookRequestSummary } from "@/features/messaging/useConversationRequests";

type Props = {
  request: CookRequestSummary;
  onSuccess: () => void;
};

type Mode = "idle" | "editing";

export function CookRequestActionBanner({ request, onSuccess }: Props) {
  const { token } = useAuth();
  const [mode, setMode] = useState<Mode>("idle");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (request.status !== "pending" && request.status !== "accepted") return null;

  const isPending = request.status === "pending";

  const date = new Date(request.startDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const addressLine =
    request.street && request.postalCode && request.city
      ? `${request.street}, ${request.postalCode} ${request.city}`
      : null;

  const handleConfirm = async () => {
    const parsed = parseFloat(price.replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) {
      setPriceError("Veuillez saisir un montant valide.");
      return;
    }
    if (!token) return;
    setLoading(true);
    try {
      await acceptRequest(token, request.id, parsed);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleRefuse = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await refuseRequest(token, request.id);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const openEditing = () => {
    setPrice(request.price != null ? String(request.price) : "");
    setPriceError(null);
    setMode("editing");
  };

  const cancelEditing = () => {
    setMode("idle");
    setPrice("");
    setPriceError(null);
  };

  return (
    <View style={styles.container}>
      {mode === "idle" && isPending && (
        <>
          <Text style={styles.title}>Nouvelle demande</Text>
          <Text style={styles.detail}>{date}</Text>
          <Text style={styles.detail}>
            {request.guestsNumber} convive{request.guestsNumber > 1 ? "s" : ""}
          </Text>
          {addressLine && <Text style={styles.detail}>{addressLine}</Text>}
          <View style={styles.actions}>
            <View style={styles.actionBtn}>
              <Button
                title="Accepter"
                variant="primary"
                disabled={loading}
                onPress={openEditing}
              />
            </View>
            <View style={styles.actionBtn}>
              <Button
                title="Refuser"
                variant="outline"
                loading={loading}
                disabled={loading}
                onPress={handleRefuse}
              />
            </View>
          </View>
        </>
      )}

      {mode === "idle" && !isPending && (
        <>
          <Text style={styles.title}>Demande acceptée ✓</Text>
          <Text style={styles.detail}>{date}</Text>
          <Text style={styles.detail}>
            {request.guestsNumber} convive{request.guestsNumber > 1 ? "s" : ""}
          </Text>
          {addressLine && <Text style={styles.detail}>{addressLine}</Text>}
          {request.price != null && (
            <Text style={styles.priceDisplay}>
              Prix proposé : {request.price} €
            </Text>
          )}
          <View style={styles.actions}>
            <View style={styles.actionBtn}>
              <Button
                title="Modifier le prix"
                variant="outline"
                disabled={loading}
                onPress={openEditing}
              />
            </View>
          </View>
        </>
      )}

      {mode === "editing" && (
        <>
          <Text style={styles.title}>
            {isPending ? "Proposer un prix" : "Modifier le prix"}
          </Text>
          <Text style={styles.detail}>{date}</Text>
          <Text style={styles.detail}>
            {request.guestsNumber} convive{request.guestsNumber > 1 ? "s" : ""}
          </Text>
          {addressLine && <Text style={styles.detail}>{addressLine}</Text>}
          <Text style={styles.label}>Votre prix pour la prestation (€)</Text>
          <TextInput
            style={[styles.input, priceError ? styles.inputError : null]}
            value={price}
            onChangeText={(v) => {
              setPrice(v);
              setPriceError(null);
            }}
            placeholder="Ex : 120"
            keyboardType="decimal-pad"
            autoFocus
          />
          {priceError && <Text style={styles.errorText}>{priceError}</Text>}
          <View style={styles.actions}>
            <View style={styles.actionBtn}>
              <Button
                title="Confirmer"
                variant="primary"
                loading={loading}
                disabled={loading}
                onPress={handleConfirm}
              />
            </View>
            <View style={styles.actionBtn}>
              <Button
                title="Annuler"
                variant="outline"
                disabled={loading}
                onPress={cancelEditing}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 12,
    padding: 16,
    margin: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 2,
  },
  priceDisplay: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginTop: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.mainDark,
  },
  errorText: {
    fontSize: 12,
    color: colors.mainDark,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
  },
});
