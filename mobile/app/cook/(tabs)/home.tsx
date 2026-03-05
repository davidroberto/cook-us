import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "@/styles/colors";
import { Button } from "@/components/ui/Button";
import { useCookRequests } from "@/features/cook/cookRequests/useCookRequests";
import type {
  CookRequestItem,
  CookRequestStatus,
} from "@/features/cook/cookRequests/repository";
import { useRouter } from "expo-router";

const STATUS_LABEL: Record<CookRequestStatus, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  cancelled: "Annulée",
};

const STATUS_COLOR: Record<CookRequestStatus, string> = {
  pending: colors.secondary,
  accepted: "#4CAF50",
  refused: colors.mainDark,
  cancelled: "#9E9E9E",
};

export default function CookHomeTab() {
  const router = useRouter();
  const { requests, loading, error, refresh } = useCookRequests();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <View style={{ marginTop: 12 }}>
          <Button title="Réessayer" variant="outline" onPress={refresh} />
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CookRequestItem }) => {
    const date = new Date(item.startDate).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.clientName}>
            {item.client.firstName} {item.client.lastName}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLOR[item.status] },
            ]}
          >
            <Text style={styles.statusText}>{STATUS_LABEL[item.status]}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.detail}>{date}</Text>
          <Text style={styles.detail}>
            {item.guestsNumber} convive{item.guestsNumber > 1 ? "s" : ""}
          </Text>
        </View>

        {item.conversationId != null && (
          <View style={styles.actions}>
            <View style={styles.actionBtn}>
              <Button
                title="Voir la discussion"
                variant="outline"
                onPress={() => router.push(`/cook/messaging/${item.conversationId}`)}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.header}>Mes propositions</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucune proposition</Text>
            <Text style={styles.emptyText}>
              Vos propositions de réservation apparaîtront ici.
            </Text>
          </View>
        }
        onRefresh={refresh}
        refreshing={false}
      />
    </SafeAreaView>
  );
}

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
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    paddingBottom: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
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
  clientName: {
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
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.56,
    textAlign: "center",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 15,
    color: colors.mainDark,
    textAlign: "center",
  },
});
