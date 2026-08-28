import { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Network from "expo-network";
import { Stack, useRouter } from "expo-router";
import { BrandMark } from "@/components/brand-mark";
import { PrimaryButton } from "@/components/app-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { buildOnboardingPayload, getOnboardingErrorMessage, type OnboardingInput } from "@/shared/onboarding";

type SubmitStatus = "idle" | "saving" | "success" | "error";

export default function OnboardingScreen() {
  const colors = useColors();
  const router = useRouter();
  const utils = trpc.useUtils();
  const submissionLock = useRef(false);
  const [name, setName] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [reserveGoal, setReserveGoal] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [invalidField, setInvalidField] = useState<keyof OnboardingInput | null>(null);
  const setup = trpc.workspace.setup.useMutation();
  const busy = status === "saving" || status === "success" || setup.isPending;

  const updateField = (field: keyof OnboardingInput, setter: (value: string) => void) => (value: string) => {
    setter(value);
    if (invalidField === field) setInvalidField(null);
    if (status === "error") {
      setStatus("idle");
      setFeedback(null);
    }
  };

  const save = async () => {
    if (submissionLock.current || busy) return;

    const result = buildOnboardingPayload({ name, monthlyGoal, reserveGoal });
    if (!result.ok) {
      setInvalidField(result.field);
      setStatus("error");
      setFeedback(result.message);
      return;
    }

    Keyboard.dismiss();
    try {
      const network = await Network.getNetworkStateAsync();
      if (network.isInternetReachable === false || network.isConnected === false) {
        setStatus("error");
        setFeedback("Sem acesso à internet. Seus dados continuam preenchidos; conecte-se e tente novamente.");
        return;
      }
    } catch {
      // Se o estado da rede não puder ser consultado, a própria mutação fará a verificação real.
    }

    submissionLock.current = true;
    setInvalidField(null);
    setStatus("saving");
    setFeedback("Salvando com segurança e preparando seu painel...");

    try {
      await setup.mutateAsync(result.payload);
      setStatus("success");
      setFeedback("Configuração concluída. Abrindo sua gestão...");
      await utils.workspace.get.invalidate();
      const freshWorkspace = await utils.workspace.get.fetch();
      if (!freshWorkspace.business) throw new Error("Não foi possível confirmar a configuração criada.");
      router.replace("/(tabs)" as never);
    } catch (error) {
      const message = getOnboardingErrorMessage(error instanceof Error ? error.message : undefined);
      setStatus("error");
      setFeedback(message);
      if (message.includes("sessão expirou")) {
        Alert.alert("Entre novamente", message, [{ text: "Ir para entrada", onPress: () => router.replace("/login") }]);
      }
    } finally {
      submissionLock.current = false;
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
          <View style={styles.top}>
            <BrandMark size={49} />
            <View style={styles.step}><Text style={[styles.stepText, { color: colors.primary }]}>PRIMEIRO ACESSO</Text></View>
            <Text style={[styles.title, { color: colors.foreground }]}>Vamos organizar seu negócio.</Text>
            <Text style={[styles.description, { color: colors.muted }]}>Comece com o que já sabe hoje. As metas são opcionais e podem ser alteradas depois.</Text>
          </View>

          <View style={styles.form}>
            <Field label="Nome do negócio" value={name} onChangeText={updateField("name", setName)} placeholder="Ex.: SK Distribuidora" colors={colors} autoFocus invalid={invalidField === "name"} editable={!busy} maxLength={120} />
            <Field label="Meta mensal de vendas" value={monthlyGoal} onChangeText={updateField("monthlyGoal", setMonthlyGoal)} placeholder="Ex.: 5.000,00" colors={colors} keyboardType="decimal-pad" prefix="R$" optional invalid={invalidField === "monthlyGoal"} editable={!busy} maxLength={16} />
            <Field label="Meta de reserva" value={reserveGoal} onChangeText={updateField("reserveGoal", setReserveGoal)} placeholder="Ex.: 1.000,00" colors={colors} keyboardType="decimal-pad" prefix="R$" optional invalid={invalidField === "reserveGoal"} editable={!busy} maxLength={16} />
          </View>

          {feedback ? (
            <View
              accessibilityLiveRegion="polite"
              style={[
                styles.feedback,
                {
                  borderColor: status === "error" ? colors.error : status === "success" ? colors.success : colors.primary,
                  backgroundColor: status === "error" ? `${colors.error}12` : status === "success" ? `${colors.success}12` : `${colors.primary}12`,
                },
              ]}
            >
              <Text style={[styles.feedbackTitle, { color: status === "error" ? colors.error : status === "success" ? colors.success : colors.primary }]}>
                {status === "error" ? "Revise e tente novamente" : status === "success" ? "Tudo certo" : "Só um instante"}
              </Text>
              <Text style={[styles.feedbackText, { color: colors.foreground }]}>{feedback}</Text>
            </View>
          ) : null}

          <View style={styles.bottom}>
            <PrimaryButton
              label={status === "success" ? "Abrindo a gestão..." : status === "saving" ? "Salvando..." : status === "error" ? "Tentar novamente" : "Começar a gestão"}
              icon="arrow.up.right"
              onPress={save}
              loading={busy}
              disabled={busy}
            />
            <Text style={[styles.securityNote, { color: colors.muted }]}>Se a internet falhar, os dados digitados permanecem nesta tela.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function Field({ label, optional, prefix, colors, invalid, ...props }: { label: string; optional?: boolean; prefix?: string; colors: ReturnType<typeof useColors>; invalid?: boolean; value: string; onChangeText: (value: string) => void; placeholder: string; autoFocus?: boolean; keyboardType?: "default" | "decimal-pad"; editable?: boolean; maxLength?: number }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: invalid ? colors.error : colors.foreground }]}>{label}{optional ? <Text style={{ color: colors.muted }}>  opcional</Text> : null}</Text>
      <View style={[styles.inputWrap, { borderColor: invalid ? colors.error : colors.border, backgroundColor: colors.surface }]}>
        {prefix ? <Text style={[styles.prefix, { color: colors.muted }]}>{prefix}</Text> : null}
        <TextInput {...props} style={[styles.input, { color: colors.foreground }]} placeholderTextColor={colors.muted} returnKeyType="done" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 28 },
  top: { gap: 12, paddingTop: 8 },
  step: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99, backgroundColor: "#168CCF16" },
  stepText: { fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  title: { fontSize: 31, lineHeight: 38, fontWeight: "800", letterSpacing: -0.7, marginTop: 3 },
  description: { fontSize: 15, lineHeight: 22, maxWidth: 350 },
  form: { gap: 18, marginTop: 30 },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "800" },
  inputWrap: { height: 55, borderWidth: 1, borderRadius: 15, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  prefix: { fontSize: 15, fontWeight: "700", marginRight: 7 },
  input: { flex: 1, fontSize: 16, fontWeight: "600", height: "100%" },
  feedback: { borderWidth: 1, borderRadius: 16, padding: 14, gap: 4, marginTop: 18 },
  feedbackTitle: { fontSize: 13, fontWeight: "800" },
  feedbackText: { fontSize: 13, lineHeight: 19, fontWeight: "600" },
  bottom: { gap: 10, marginTop: "auto", paddingTop: 24 },
  securityNote: { fontSize: 11, lineHeight: 16, textAlign: "center", paddingHorizontal: 12 },
});
