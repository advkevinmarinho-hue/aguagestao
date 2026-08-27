import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { BrandMark } from "@/components/brand-mark";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { startOAuthLogin } from "@/constants/oauth";

export default function LoginScreen() {
  const colors = useColors();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await startOAuthLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="px-6">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.brandArea}>
          <View style={[styles.markWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}><BrandMark size={80} /></View>
          <View style={styles.titleArea}>
            <Text style={[styles.brandName, { color: colors.foreground }]}>SK Água Gestão</Text>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>DISTRIBUIDORA DE ÁGUA</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.foreground }]}>Seus dados em todo lugar.</Text>
          <Text style={[styles.description, { color: colors.muted }]}>Entre para registrar o seu negócio com segurança e acessar as mesmas informações em qualquer celular.</Text>
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [styles.loginButton, { backgroundColor: colors.primary }, (pressed || loading) && styles.pressed]}
          >
            <Text style={styles.loginButtonText}>{loading ? "Abrindo acesso..." : "Entrar com e-mail"}</Text>
          </Pressable>
          <Text style={[styles.note, { color: colors.muted }]}>Ao entrar, seus registros ficam vinculados à sua conta.</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", paddingVertical: 28 },
  brandArea: { alignItems: "center", gap: 14, marginTop: 35 },
  markWrap: { width: 112, height: 112, borderRadius: 34, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  titleArea: { alignItems: "center", gap: 4 },
  brandName: { fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.8 },
  content: { gap: 14, paddingBottom: 40 },
  title: { fontSize: 37, lineHeight: 42, letterSpacing: -1.1, fontWeight: "800", maxWidth: 310 },
  description: { fontSize: 16, lineHeight: 24, maxWidth: 335 },
  footer: { gap: 15 },
  loginButton: { minHeight: 56, justifyContent: "center", alignItems: "center", borderRadius: 18 },
  loginButtonText: { fontSize: 16, fontWeight: "800", color: "#FFFFFF" },
  note: { fontSize: 12, lineHeight: 18, textAlign: "center", paddingHorizontal: 12 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
