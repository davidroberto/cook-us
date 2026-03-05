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
import { typography } from "@/styles/typography";
import { getApiUrl } from "@/features/api/getApiUrl";

async function updateRequestAddress(
  token: string,
  requestId: number,
  address: { street: string; postalCode: string; city: string }
): Promise<void> {
  const res = await fetch(`${getApiUrl()}/cook-request/${requestId}/address`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Erreur réseau");
  }
}

type Props = {
  id: number;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  token: string | null;
  canEdit: boolean;
  onUpdated: () => void;
};

export function AddressEditor({
  id,
  street,
  postalCode,
  city,
  token,
  canEdit,
  onUpdated,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [streetValue, setStreetValue] = useState(street ?? "");
  const [postalCodeValue, setPostalCodeValue] = useState(postalCode ?? "");
  const [cityValue, setCityValue] = useState(city ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setStreetValue(street ?? "");
    setPostalCodeValue(postalCode ?? "");
    setCityValue(city ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!streetValue.trim() || !postalCodeValue.trim() || !cityValue.trim()) {
      setError("Tous les champs sont requis.");
      return;
    }
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await updateRequestAddress(token, id, {
        street: streetValue.trim(),
        postalCode: postalCodeValue.trim(),
        city: cityValue.trim(),
      });
      setEditing(false);
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  if (!canEdit) return null;

  if (!editing) {
    return (
      <TouchableOpacity onPress={handleOpen} style={styles.editBtn}>
        <Text style={styles.editBtnText}>Modifier l'adresse</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        value={streetValue}
        onChangeText={setStreetValue}
        placeholder="Rue"
        autoCapitalize="sentences"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={postalCodeValue}
        onChangeText={setPostalCodeValue}
        placeholder="Code postal"
        keyboardType="numeric"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={cityValue}
        onChangeText={setCityValue}
        placeholder="Ville"
        autoCapitalize="words"
        autoCorrect={false}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            setEditing(false);
            setError(null);
          }}
          style={styles.cancelBtn}
          disabled={saving}
        >
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  editBtnText: {
    ...typography.styles.body2Regular,
    color: colors.main,
    textDecorationLine: "underline",
  },
  form: {
    marginTop: 8,
    gap: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
  },
  error: {
    fontSize: 12,
    color: colors.mainDark,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  cancelText: {
    ...typography.styles.body2Regular,
    color: colors.text,
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.main,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveText: {
    ...typography.styles.body2Bold,
    color: colors.white,
  },
});
