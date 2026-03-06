import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/colors";
import { Button } from "@/components/ui/Button";
import { useCookStats } from "@/features/cook/stats/useCookStats";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import type { StatPeriod } from "@/features/cook/stats/repository";

const MONTH_LABELS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

const PERIOD_OPTIONS: { label: string; value: StatPeriod }[] = [
  { label: "1 mois", value: "1m" },
  { label: "3 mois", value: "3m" },
  { label: "6 mois", value: "6m" },
  { label: "1 an", value: "1y" },
];

function PeriodSelect({
  value,
  onChange,
}: {
  value: StatPeriod;
  onChange: (v: StatPeriod) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = PERIOD_OPTIONS.find((o) => o.value === value)!;

  return (
    <>
      <TouchableOpacity style={select.trigger} onPress={() => setOpen(true)}>
        <Text style={select.triggerText}>{current.label}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.main} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={select.backdrop} onPress={() => setOpen(false)}>
          <View style={select.dropdown}>
            {PERIOD_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  select.option,
                  opt.value === value && select.optionActive,
                ]}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    select.optionText,
                    opt.value === value && select.optionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const MEAL_TYPE_LABEL: Record<string, string> = {
  breakfast: "Petit-déj",
  lunch: "Déjeuner",
  dinner: "Dîner",
};

function formatMonthPeriod(period: string): string {
  const [, month] = period.split("-");
  return MONTH_LABELS[parseInt(month, 10) - 1] ?? period;
}

function formatWeekPeriod(period: string): string {
  const [, month, day] = period.split("-");
  return `${day}/${month}`;
}

function BarChart({
  data,
  granularity,
}: {
  data: Array<{ period: string; count: number }>;
  granularity: "week" | "month";
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const BAR_MAX_HEIGHT = 80;
  const formatLabel = granularity === "month" ? formatMonthPeriod : formatWeekPeriod;
  const showEveryN = data.length > 8 ? 2 : 1;

  return (
    <View style={chart.container}>
      {data.map((item, i) => (
        <View key={item.period} style={chart.barWrapper}>
          <Text style={chart.barValue}>{item.count > 0 ? item.count : ""}</Text>
          <View
            style={[
              chart.bar,
              {
                height: Math.max(
                  (item.count / max) * BAR_MAX_HEIGHT,
                  item.count > 0 ? 4 : 2
                ),
                backgroundColor: item.count > 0 ? colors.main : colors.tertiary,
              },
            ]}
          />
          <Text style={chart.barLabel}>
            {i % showEveryN === 0 ? formatLabel(item.period) : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: 18,
            color: i <= Math.round(rating) ? colors.secondary : colors.tertiary,
          }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

export default function CookStatsTab() {
  const { stats, loading, error, period, setPeriod, refresh } = useCookStats();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Erreur inconnue"}</Text>
        <View style={{ marginTop: 12 }}>
          <Button title="Réessayer" variant="outline" onPress={refresh} />
        </View>
      </View>
    );
  }

  const totalMeals = Object.values(stats.mealTypeDistribution).reduce(
    (s, v) => s + v,
    0
  );
  const ratingEntries = [5, 4, 3, 2, 1];
  const totalReviews = Object.values(stats.ratingDistribution).reduce(
    (s, v) => s + v,
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Mes statistiques</Text>
          <PeriodSelect value={period} onChange={setPeriod} />
        </View>

        {/* KPI prestations */}
        <View style={styles.kpiRow}>
          <StatCard
            label="Total"
            value={stats.completedCount.total}
            sub="prestations"
          />
          <StatCard
            label="Cette semaine"
            value={stats.completedCount.thisWeek}
            sub="prestations"
          />
          <StatCard
            label="Ce mois"
            value={stats.completedCount.thisMonth}
            sub="prestations"
          />
        </View>

        {/* Taux d'acceptation + Convives */}
        <View style={styles.kpiRow}>
          <StatCard
            label="Taux d'acceptation"
            value={
              stats.acceptanceRate !== null ? `${stats.acceptanceRate}%` : "—"
            }
          />
          <StatCard
            label="Convives moyens"
            value={
              stats.averageGuestsNumber !== null
                ? stats.averageGuestsNumber
                : "—"
            }
            sub="par prestation"
          />
        </View>

        {/* Évolution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Évolution des prestations</Text>
          <BarChart data={stats.evolution} granularity={stats.granularity} />
        </View>

        {/* Avis clients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avis clients</Text>
          {stats.averageRating !== null ? (
            <>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingValue}>{stats.averageRating}</Text>
                <StarRating rating={stats.averageRating} />
                <Text style={styles.ratingCount}>({totalReviews} avis)</Text>
              </View>
              {ratingEntries.map((star) => {
                const count = stats.ratingDistribution[star] ?? 0;
                const pct = totalReviews > 0 ? count / totalReviews : 0;
                return (
                  <View key={star} style={styles.ratingBarRow}>
                    <Text style={styles.ratingBarStar}>{star}★</Text>
                    <View style={styles.ratingBarTrack}>
                      <View
                        style={[
                          styles.ratingBarFill,
                          { width: `${Math.round(pct * 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.ratingBarCount}>{count}</Text>
                  </View>
                );
              })}
            </>
          ) : (
            <Text style={styles.emptyText}>Aucun avis pour le moment</Text>
          )}
        </View>

        {/* Types de repas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Types de repas</Text>
          {totalMeals > 0 ? (
            Object.entries(stats.mealTypeDistribution).map(([type, count]) => {
              const pct = totalMeals > 0 ? count / totalMeals : 0;
              return (
                <View key={type} style={styles.mealRow}>
                  <Text style={styles.mealLabel}>
                    {MEAL_TYPE_LABEL[type] ?? type}
                  </Text>
                  <View style={styles.mealBarTrack}>
                    <View
                      style={[
                        styles.mealBarFill,
                        { width: `${Math.round(pct * 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.mealCount}>{count}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Aucune prestation complétée</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const chart = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 120,
    paddingTop: 16,
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
  },
  barValue: {
    fontSize: 11,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 2,
    minHeight: 14,
  },
  bar: {
    width: 16,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 9,
    color: colors.text,
    opacity: 0.56,
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: colors.opacity[8],
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.main,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  statSub: {
    fontSize: 10,
    color: colors.text,
    opacity: 0.56,
    marginTop: 2,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: colors.opacity[8],
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  ratingCount: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.56,
  },
  ratingBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  ratingBarStar: {
    fontSize: 12,
    color: colors.text,
    width: 22,
    textAlign: "right",
  },
  ratingBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  ratingBarFill: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  ratingBarCount: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.64,
    width: 20,
    textAlign: "right",
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  mealLabel: {
    fontSize: 13,
    color: colors.text,
    width: 70,
  },
  mealBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.background,
    borderRadius: 5,
    overflow: "hidden",
  },
  mealBarFill: {
    height: "100%",
    backgroundColor: colors.main,
    borderRadius: 5,
  },
  mealCount: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    width: 24,
    textAlign: "right",
  },
  errorText: {
    fontSize: 15,
    color: colors.mainDark,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.56,
    fontStyle: "italic",
  },
});

const select = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    width: 120,
    justifyContent: "space-between",
    paddingRight: 12,
    paddingVertical: 10,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: colors.opacity[8],
    shadowRadius: 4,
    elevation: 2,
  },
  triggerText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
    textAlign: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 16,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
    minWidth: 130,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: colors.opacity[16],
    shadowRadius: 12,
    elevation: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  optionActive: {
    backgroundColor: colors.background,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  optionTextActive: {
    fontWeight: "700",
    color: colors.main,
  },
});
