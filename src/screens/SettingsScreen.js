import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";

export default function SettingsScreen({ navigation, apiKey, onSaveKey }) {
  const [value, setValue] = useState(apiKey || "");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.bar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.body}>
        <Text style={styles.heading}>Optional Gemini API key</Text>
        <Text style={styles.copy}>
          SiteForge already generates websites on the device. If you paste a Google Gemini key, it
          designs a custom page from your text instead of using the built-in templates.
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="AIza..."
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          style={styles.cta}
          onPress={() => {
            onSaveKey(value.trim());
            navigation.goBack();
          }}
        >
          <Text style={styles.ctaText}>Save key</Text>
        </Pressable>
        <Pressable
          style={styles.ghost}
          onPress={() => {
            setValue("");
            onSaveKey("");
          }}
        >
          <Text style={styles.ghostText}>Remove key (use offline generator)</Text>
        </Pressable>
      </View>
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
  body: { padding: 20 },
  heading: { color: colors.text, fontSize: 22, fontWeight: "800" },
  copy: { color: colors.muted, marginTop: 10, marginBottom: 18, lineHeight: 22 },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    color: colors.text,
    marginBottom: 16,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaText: { color: "#0B1220", fontWeight: "800" },
  ghost: { paddingVertical: 16, alignItems: "center" },
  ghostText: { color: colors.muted },
});
