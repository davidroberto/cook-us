import {
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";

const patternImage = require("../../assets/images/food-pattern.png");

interface ScreenBackgroundProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}

export function ScreenBackground({
  children,
  edges,
  style,
}: ScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <Image
        source={patternImage}
        style={styles.pattern}
        resizeMode="repeat"
        pointerEvents="none"
      />
      <SafeAreaView style={[styles.content, style]} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
  },
});
