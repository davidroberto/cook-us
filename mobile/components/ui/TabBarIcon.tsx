import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface TabBarIconProps {
  name: IoniconsName;
  color: string;
  size: number;
}

export function TabBarIcon({ name, color, size }: TabBarIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
