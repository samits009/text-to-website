import { useMemo, useState } from "react";
import { createElement } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { colors } from "../theme";

function HtmlPreview({ html }) {
  if (Platform.OS === "web") {
    return (
      <View style={styles.previewContainer}>
        {createElement("iframe", {
          title: "website-preview",
          srcDoc: html,
          style: {
            width: "100%",
            height: "100%",
            flex: 1,
            border: "none",
            backgroundColor: "#ffffff",
          },
        })}
      </View>
    );
  }
  return (
    <View style={styles.previewContainer}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ flex: 1, backgroundColor: "#ffffff" }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        startInLoadingState={true}
      />
    </View>
  );
}

export default function PreviewScreen({ route, navigation }) {
  const { html, prompt, mode } = route.params;
  const [tab, setTab] = useState("preview");
  const source = useMemo(() => html, [html]);

  async function onShare() {
    await Share.share({
      message: `Website from SiteForge\n\n${prompt}\n\n${html}`,
      title: "SiteForge website",
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.bar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{mode === "ai" ? "AI preview" : "Preview"}</Text>
        <Pressable onPress={onShare}>
          <Text style={styles.link}>Share</Text>
        </Pressable>
      </View>
      <View style={styles.tabs}>
        {["preview", "code"].map((item) => (
          <Pressable
            key={item}
            onPress={() => setTab(item)}
            style={[styles.tab, tab === item && styles.tabOn]}
          >
            <Text style={[styles.tabText, tab === item && styles.tabTextOn]}>
              {item === "preview" ? "Website" : "HTML"}
            </Text>
          </Pressable>
        ))}
      </View>
      {tab === "preview" ? (
        <HtmlPreview html={source} />
      ) : (
        <ScrollView style={styles.codeWrap} contentContainerStyle={{ padding: 16 }}>
          <Text selectable style={styles.code}>
            {html}
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: { color: colors.text, fontWeight: "700" },
  link: { color: colors.accent, fontWeight: "700" },
  tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  tab: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: colors.card,
  },
  tabOn: { backgroundColor: colors.accent },
  tabText: { color: colors.muted, fontWeight: "700" },
  tabTextOn: { color: "#0B1220" },
  codeWrap: { flex: 1, backgroundColor: "#070B14" },
  code: { color: "#D1D5DB", fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 12 },
  previewContainer: { flex: 1, width: "100%", height: "100%", backgroundColor: "#ffffff" },
});
