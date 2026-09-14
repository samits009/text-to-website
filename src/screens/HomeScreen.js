import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { parsePrompt } from "../engine/parsePrompt";
import { generateWebsite } from "../engine/generateWebsite";
import { generateWithGemini } from "../engine/aiGenerate";
import { colors, EXAMPLES } from "../theme";

export default function HomeScreen({ navigation, apiKey }) {
  const [prompt, setPrompt] = useState(EXAMPLES[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onGenerate() {
    const text = prompt.trim();
    if (text.length < 8) {
      setError("Describe the website in a bit more detail.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      let html;
      let mode = "local";
      if (apiKey) {
        html = await generateWithGemini(text, apiKey);
        mode = "ai";
      } else {
        const spec = parsePrompt(text);
        html = generateWebsite(spec);
      }
      navigation.navigate("Preview", { html, prompt: text, mode });
    } catch (err) {
      setError(err.message || "Could not generate the website.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.topRow}>
            <View>
              <Text style={styles.kicker}>IETICT · Project 1</Text>
              <Text style={styles.title}>SiteForge</Text>
            </View>
            <Pressable onPress={() => navigation.navigate("Settings")} style={styles.gear}>
              <Text style={styles.gearText}>{apiKey ? "AI on" : "Settings"}</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Type what you want. The app builds a real webpage you can preview, copy, and share.
          </Text>

          <Text style={styles.label}>Website brief</Text>
          <TextInput
            style={styles.input}
            multiline
            value={prompt}
            onChangeText={setPrompt}
            placeholder="e.g. A bakery website for Crumb & Co in Pune, pink and cream, online orders..."
            placeholderTextColor={colors.muted}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Try an example</Text>
          <View style={styles.chips}>
            {EXAMPLES.map((example, i) => (
              <Pressable key={i} onPress={() => setPrompt(example)} style={styles.chip}>
                <Text style={styles.chipText} numberOfLines={2}>
                  {example}
                </Text>
              </Pressable>
            ))}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={onGenerate}
            disabled={busy}
            style={[styles.cta, busy && { opacity: 0.7 }]}
          >
            {busy ? (
              <ActivityIndicator color="#0B1220" />
            ) : (
              <Text style={styles.ctaText}>
                {apiKey ? "Generate with AI" : "Generate website"}
              </Text>
            )}
          </Pressable>
          <Text style={styles.hint}>
            {apiKey
              ? "Using your Gemini API key for a custom design."
              : "Works offline. Add a Gemini key in Settings for AI-designed pages."}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  kicker: { color: colors.accent, letterSpacing: 1.4, fontSize: 11, fontWeight: "700" },
  title: { color: colors.text, fontSize: 34, fontWeight: "800", marginTop: 4 },
  subtitle: { color: colors.muted, fontSize: 16, marginTop: 10, marginBottom: 22, lineHeight: 22 },
  gear: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  gearText: { color: colors.text, fontWeight: "600", fontSize: 12 },
  label: { color: colors.text, fontWeight: "700", marginBottom: 8, marginTop: 8 },
  input: {
    minHeight: 140,
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    color: colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
  chips: { gap: 8, marginBottom: 16 },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  chipText: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  error: { color: colors.danger, marginBottom: 10 },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaText: { color: "#0B1220", fontWeight: "800", fontSize: 16 },
  hint: { color: colors.muted, textAlign: "center", marginTop: 12, fontSize: 12 },
});
