import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "@/styles";

export const ProfileSkeleton = () => {
  return (
    <View style={styles.container} testID="profile-skeleton">
      <SkeletonBox style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 16 }} />
      <SkeletonBox style={{ width: 180, height: 24, marginBottom: 8 }} />
      <SkeletonBox style={{ width: 120, height: 18, marginBottom: 8 }} />
      <SkeletonBox style={{ width: 80, height: 18, marginBottom: 16 }} />
      <SkeletonBox style={{ width: "100%", height: 72, marginBottom: 32 }} />
      <SkeletonBox style={{ width: 200, height: 48, borderRadius: 12 }} />
    </View>
  );
};

function SkeletonBox({ style }: { style: object }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.skeletonBox, style, { opacity }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 24,
    gap: 8,
  },
  skeletonBox: {
    backgroundColor: colors.tertiary,
    borderRadius: 4,
  },
});
