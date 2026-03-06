import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { colors } from "@/styles/colors";
import { useCookCalendar } from "@/features/cook/calendar/useCookCalendar";
import { MonthCalendar } from "@/features/cook/calendar/MonthCalendar";
import type { DayStatus } from "@/features/cook/calendar/MonthCalendar";

function getToday() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export default function CalendrierTab() {
  const today = getToday();
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);

  const { state, blockDate, unblockDate } = useCookCalendar(year, month);

  const handlePrev = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleDayPress = (date: string, status: DayStatus) => {
    if (status === "past") return;

    if (status === "booking") {
      Alert.alert(
        "Réservation",
        "Ce jour a une réservation en cours. Vous ne pouvez pas le bloquer."
      );
      return;
    }

    if (status === "blocked") {
      Alert.alert(
        "Débloquer cette date",
        `Voulez-vous rendre le ${formatDate(date)} à nouveau disponible ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Débloquer",
            onPress: () =>
              unblockDate(date).catch((e: Error) =>
                Alert.alert("Erreur", e.message)
              ),
          },
        ]
      );
      return;
    }

    // free
    Alert.alert(
      "Bloquer cette date",
      `Voulez-vous bloquer le ${formatDate(date)} ? Les clients ne pourront plus envoyer de proposition ce jour.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Bloquer",
          style: "destructive",
          onPress: () =>
            blockDate(date).catch((e: Error) =>
              Alert.alert("Erreur", e.message)
            ),
        },
      ]
    );
  };

  return (
    <ScreenBackground edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Calendrier</Text>
        <Text style={styles.subtitle}>
          Gérez vos réservations et vos indisponibilités
        </Text>

        {state.status === "loading" && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.main} />
          </View>
        )}

        {state.status === "error" && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{state.message}</Text>
          </View>
        )}

        {state.status === "success" && (
          <MonthCalendar
            year={year}
            month={month}
            requests={state.data.requests}
            blockedDates={state.data.blockedDates}
            onPrev={handlePrev}
            onNext={handleNext}
            onDayPress={handleDayPress}
          />
        )}

        <View style={styles.tips}>
          <Text style={styles.tipTitle}>Comment ça marche ?</Text>
          <Text style={styles.tipText}>
            • Appuyez sur un jour libre pour le bloquer{"\n"}
            • Appuyez sur un jour bloqué pour le débloquer{"\n"}
            • Les jours avec une réservation ne peuvent pas être bloqués
          </Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function formatDate(date: string): string {
  const [, m, d] = date.split("-");
  return `${d}/${m}`;
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    marginBottom: 20,
  },
  centered: {
    paddingVertical: 48,
    alignItems: "center",
  },
  errorText: {
    fontSize: 15,
    color: colors.mainDark,
    textAlign: "center",
  },
  tips: {
    marginTop: 20,
    backgroundColor: colors.tertiary + "40",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.main,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.8,
    lineHeight: 22,
  },
});
