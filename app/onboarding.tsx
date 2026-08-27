import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { BrandMark } from "@/components/brand-mark";
import { PrimaryButton } from "@/components/app-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

function toCents(value: string) {
  const normalized = value.replace(/[^0-9,]/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
}

export default function OnboardingScreen() {
  const colors = useColors();
  const router = useRouter();
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [reserveGoal, setReserveGoal] = useState("");
  const setup = trpc.workspace.setup.useMutation({
    onSuccess: async () => {
      await utils.workspace.get.invalidate();
      router.replace("/(tabs)");
    },
    onError: (error) => Alert.alert("Não foi possível salvar", error.message),
  });

  const save = () => {
    if (name.trim().length < 2) {
      Alert.alert("Nome necessário", "Informe o nome do seu negócio para continuar.");
      return;
    }
    setup.mutate({ name: name.trim(), monthlyGoalCents: toCents(monthlyGoal), reserveGoalCents: toCents(reserveGoal) });
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="px-6">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.top}>
          <BrandMark size={49} />
          <View style={styles.step}><Text style={[styles.stepText, { color: colors.primary }]}>PRIMEIRO ACESSO</Text></View>
          <Text style={[styles.title, { color: colors.foreground }]}>Vamos organizar seu negócio.</Text>
          <Text style={[styles.description, { color: colors.muted }]}>Comece com o que já sabe hoje. As metas são opcionais e podem ser alteradas depois.</Text>
        </View>

        <View style={styles.form}>
          <Field label="Nome do negócio" value={name} onChangeText={setName} placeholder="Ex.: SK Distribuidora" colors={colors} autoFocus />
          <Field label="Meta mensal de vendas" value={monthlyGoal} onChangeText={setMonthlyGoal} placeholder="Ex.: 5.000,00" colors={colors} keyboardType="decimal-pad" prefix="R$" optional />
          <Field label="Meta de reserva" value={reserveGoal} onChangeText={setReserveGoal} placeholder="Ex.: 1.000,00" colors={colors} keyboardType="decimal-pad" prefix="R$" optional />
        </View>

        <View style={styles.bottom}>
          <PrimaryButton label="Começar a gestão" icon="arrow.up.right" onPress={save} loading={setup.isPending} />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function Field({ label, optional, prefix, colors, ...props }: { label: string; optional?: boolean; prefix?: string; colors: ReturnType<typeof useColors>; value: string; onChangeText: (value: string) => void; placeholder: string; autoFocus?: boolean; keyboardType?: "default" | "decimal-pad" }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}{optional ? <Text style={{ color: colors.muted }}>  opcional</Text> : null}</Text>
      <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        {prefix ? <Text style={[styles.prefix, { color: colors.muted }]}>{prefix}</Text> : null}
        <TextInput {...props} style={[styles.input, { color: colors.foreground }]} placeholderTextColor={colors.muted} returnKeyType="done" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", paddingVertical: 24 },
  top: { gap: 12, paddingTop: 8 },
  step: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99, backgroundColor: "#168CCF16" },
  stepText: { fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  title: { fontSize: 31, lineHeight: 38, fontWeight: "800", letterSpacing: -0.7, marginTop: 3 },
  description: { fontSize: 15, lineHeight: 22, maxWidth: 350 },
  form: { gap: 18, marginTop: 32 },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "800" },
  inputWrap: { height: 55, borderWidth: 1, borderRadius: 15, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  prefix: { fontSize: 15, fontWeight: "700", marginRight: 7 },
  input: { flex: 1, fontSize: 16, fontWeight: "600", height: "100%" },
  bottom: { paddingTop: 20 },
});
