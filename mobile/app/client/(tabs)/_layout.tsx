import { Tabs } from "expo-router";
import { colors } from "@/styles/colors";
import { TabBarIcon } from "@/components/ui/TabBarIcon";
import { useUnreadTotal } from "@/features/messaging/useUnreadTotal";

export default function TabsLayout() {
  const unreadTotal = useUnreadTotal();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.main,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.tertiary,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="chatbubble-ellipses" color={color} size={size} />
          ),
          tabBarBadge: unreadTotal > 0 ? "" : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.main,
            minWidth: 10,
            maxHeight: 10,
            borderRadius: 5,
            fontSize: 0,
          },
        }}
      />
      <Tabs.Screen
        name="compte"
        options={{
          title: "Compte",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
