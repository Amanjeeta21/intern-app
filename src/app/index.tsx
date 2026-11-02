import * as Device from "expo-device";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedIcon } from "@/components/animated-icon";
import ProfileCard from "@/components/ProfileCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";

import { MaxContentWidth, Spacing } from "@/constants/theme";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }

  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }

  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";

  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView
      lightColor="#ffffff"
      darkColor="#ffffff"
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView
            lightColor="#ffffff"
            darkColor="#ffffff"
            style={styles.heroSection}
          >
            <AnimatedIcon />

            <ThemedText type="title" style={[styles.title, styles.darkText]}>
              Welcome To&nbsp;Expo Go
            </ThemedText>
          </ThemedView>

          <ThemedText type="code" style={[styles.code, styles.darkText]}>
            get started
          </ThemedText>

          <ProfileCard
            name="Amanjeeta"
            role="Software Engineering Intern"
            photoUrl={require("../../Photo.jpeg")}
          />

          {/*
<ThemedView type="backgroundElement" style={styles.stepContainer}>
  <HintRow
    title="Try editing"
    hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
  />

  <HintRow title="Dev tools" hint={getDevMenuHint()} />

  <HintRow
    title="Fresh start"
    hint={<ThemedText type="code">npm run reset-project</ThemedText>}
  />
</ThemedView>
*/}
          {Platform.OS === "web" && <WebBadge />}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#100d0d",
  },

  safeArea: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },

  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    backgroundColor: "#ffffff",
  },

  title: {
    textAlign: "center",
  },

  darkText: {
    color: "#111111",
  },

  code: {
    textTransform: "uppercase",
  },

  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
