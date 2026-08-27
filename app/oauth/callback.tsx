import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { BrandMark } from "@/components/brand-mark";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type Status = "processing" | "success" | "error";

export default function OAuthCallback() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string; state?: string; error?: string; sessionToken?: string; user?: string }>();
  const [status, setStatus] = useState<Status>("processing");
  const [message, setMessage] = useState("Validando seu acesso com segurança.");

  useEffect(() => {
    let active = true;
    const finish = async () => {
      try {
        if (params.error) throw new Error("O acesso foi cancelado ou não pôde ser concluído.");
        let token = params.sessionToken ?? null;
        let user: Auth.User | null = null;

        if (!token && params.code && params.state) {
          const result = await Api.exchangeOAuthCode(params.code, params.state);
          token = result.sessionToken;
          if (result.user) {
            user = { id: result.user.id, openId: result.user.openId, name: result.user.name, email: result.user.email, loginMethod: result.user.loginMethod, lastSignedIn: new Date(result.user.lastSignedIn || Date.now()) };
          }
        }
        if (!token) throw new Error("Não encontramos uma sessão válida. Tente entrar novamente.");
        await Auth.setSessionToken(token);

        if (!user && params.user && typeof globalThis.atob === "function") {
          try {
            const parsed = JSON.parse(globalThis.atob(params.user));
            user = { id: parsed.id, openId: parsed.openId, name: parsed.name ?? null, email: parsed.email ?? null, loginMethod: parsed.loginMethod ?? null, lastSignedIn: new Date(parsed.lastSignedIn || Date.now()) };
          } catch { /* A sessão continua válida mesmo sem o cache do perfil. */ }
        }
        if (user) await Auth.setUserInfo(user);
        if (!active) return;
        setStatus("success"); setMessage("Acesso confirmado. Preparando seu negócio...");
        setTimeout(() => router.replace("/(tabs)"), 600);
      } catch (error) {
        if (!active) return;
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Não foi possível concluir o acesso.");
      }
    };
    if (params.code || params.state || params.error || params.sessionToken) finish();
    else {
      Linking.getInitialURL().then((url) => {
        if (!url) { setStatus("error"); setMessage("Não recebemos a confirmação de acesso."); return; }
        const parsed = new URL(url); const code = parsed.searchParams.get("code"); const state = parsed.searchParams.get("state");
        if (!code || !state) { setStatus("error"); setMessage("Não recebemos os dados necessários para validar o acesso."); return; }
        router.replace({ pathname: "/oauth/callback", params: { code, state } });
      }).catch(() => { setStatus("error"); setMessage("Não foi possível abrir a confirmação de acesso."); });
    }
    return () => { active = false; };
  }, [params.code, params.error, params.sessionToken, params.state, params.user, router]);

  return <ScreenContainer edges={["top", "bottom", "left", "right"]} className="px-6"><View style={styles.content}><BrandMark size={70} /><View style={styles.texts}>{status === "processing" ? <ActivityIndicator size="large" color={colors.primary} /> : null}<Text style={[styles.title, { color: status === "error" ? colors.error : colors.foreground }]}>{status === "success" ? "Tudo certo" : status === "error" ? "Acesso não concluído" : "Entrando na gestão"}</Text><Text style={[styles.message, { color: colors.muted }]}>{message}</Text></View>{status === "error" ? <Pressable onPress={() => router.replace("/login")} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={styles.buttonText}>Voltar para entrada</Text></Pressable> : null}</View></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { flex: 1, alignItems: "center", justifyContent: "center", gap: 22 }, texts: { alignItems: "center", gap: 10, maxWidth: 310 }, title: { fontSize: 25, lineHeight: 32, fontWeight: "800", textAlign: "center" }, message: { fontSize: 15, lineHeight: 22, textAlign: "center" }, button: { minHeight: 52, borderRadius: 16, paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }, buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" }, pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] } });
