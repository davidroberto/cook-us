import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";
import { colors } from "@/styles/colors";

type Props = {
  onFinish: () => void;
};

const DURATION = 3000;

export function AnimatedSplash({ onFinish }: Props) {
  const mainOpacity = useRef(new Animated.Value(0)).current;
  const mainScale = useRef(new Animated.Value(0.5)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(10)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Phase 1: Logo + title appear together
    Animated.parallel([
      Animated.timing(mainOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(mainScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Phase 2: Tagline slides up
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 700);

    // Phase 3: Fade out
    setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, DURATION - 500);

    const timer = setTimeout(onFinish, DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: mainOpacity,
            transform: [{ scale: mainScale }],
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/logo-without-text.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Animated.Text style={styles.title}>
            Cook'US
          </Animated.Text>
        </Animated.View>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          partage de cuisines
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontFamily: "Alexandria_800ExtraBold",
    fontSize: 48,
    color: colors.main,
    letterSpacing: -4.8,
    marginTop: -20,
    paddingRight: 8,
  },
  tagline: {
    fontFamily: "DancingScript_700Bold",
    fontSize: 28,
    color: colors.tertiary,
    marginTop: 8,
  },
});
