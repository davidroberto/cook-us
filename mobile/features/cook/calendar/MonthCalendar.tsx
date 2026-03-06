import { colors } from "@/styles/colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { CalendarRequest } from "./useCookCalendar";

const DAY_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Monday = 0, ... Sunday = 6
function firstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month - 1, 1).getDay();
  return (day + 6) % 7; // shift so Monday = 0
}

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export type DayStatus = "past" | "free" | "booking" | "blocked";

type Props = {
  year: number;
  month: number;
  requests: CalendarRequest[];
  blockedDates: string[];
  onPrev: () => void;
  onNext: () => void;
  onDayPress: (date: string, status: DayStatus) => void;
};

export function MonthCalendar({
  year,
  month,
  requests,
  blockedDates,
  onPrev,
  onNext,
  onDayPress,
}: Props) {
  const today = toYMD(new Date());
  const daysInMonth = getDaysInMonth(year, month);
  const startOffset = firstDayOfWeek(year, month);

  const bookingDates = new Set(requests.map((r) => r.date));
  const blockedSet = new Set(blockedDates);

  const getDayStatus = (dateStr: string): DayStatus => {
    if (dateStr < today) return "past";
    if (bookingDates.has(dateStr)) return "booking";
    if (blockedSet.has(dateStr)) return "blocked";
    return "free";
  };

  // Build grid cells: null = empty slot, number = day
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrev} style={styles.navBtn}>
          <Text style={styles.navText}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {MONTH_NAMES[month - 1]} {year}
        </Text>
        <TouchableOpacity onPress={onNext} style={styles.navBtn}>
          <Text style={styles.navText}>{"›"}</Text>
        </TouchableOpacity>
      </View>

      {/* Day labels */}
      <View style={styles.dayLabels}>
        {DAY_LABELS.map((label) => (
          <Text key={label} style={styles.dayLabel}>
            {label}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {cells.map((day, idx) => {
          if (day === null) {
            return <View key={`empty-${idx}`} style={styles.dayCell} />;
          }
          const m = String(month).padStart(2, "0");
          const d = String(day).padStart(2, "0");
          const dateStr = `${year}-${m}-${d}`;
          const status = getDayStatus(dateStr);
          const isToday = dateStr === today;

          return (
            <TouchableOpacity
              key={dateStr}
              style={[styles.dayCell, dayCellStyle(status, isToday)]}
              onPress={() => onDayPress(dateStr, status)}
              disabled={status === "past"}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayText, dayTextStyle(status, isToday)]}>
                {day}
              </Text>
              {status === "blocked" && (
                <View style={styles.blockedLine} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color={colors.main} label="Réservation" />
        <LegendItem color="#9E9E9E" label="Bloqué" />
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function dayCellStyle(status: DayStatus, isToday: boolean) {
  if (status === "booking") return styles.dayCellBooking;
  if (status === "blocked") return styles.dayCellBlocked;
  if (isToday) return styles.dayCellToday;
  return {};
}

function dayTextStyle(status: DayStatus, isToday: boolean) {
  if (status === "past") return styles.dayTextPast;
  if (status === "booking") return styles.dayTextBooking;
  if (status === "blocked") return styles.dayTextBlocked;
  if (isToday) return styles.dayTextToday;
  return {};
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  navText: {
    fontSize: 24,
    color: colors.main,
    fontWeight: "600",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  dayLabels: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    opacity: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 2,
    position: "relative",
  },
  dayCellBooking: {
    backgroundColor: colors.main + "22",
    borderWidth: 1,
    borderColor: colors.main,
  },
  dayCellBlocked: {
    backgroundColor: "#E0E0E0",
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: colors.main,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  dayTextPast: {
    color: colors.text,
    opacity: 0.25,
  },
  dayTextBooking: {
    color: colors.main,
    fontWeight: "700",
  },
  dayTextBlocked: {
    color: "#757575",
    textDecorationLine: "line-through",
  },
  dayTextToday: {
    color: colors.main,
    fontWeight: "700",
  },
  blockedLine: {
    position: "absolute",
    bottom: 4,
    width: 16,
    height: 2,
    backgroundColor: "#9E9E9E",
    borderRadius: 1,
  },
  legend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
});
