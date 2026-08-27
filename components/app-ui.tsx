import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { IconSymbol, type SKIconName } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>{children}</View>;
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function PrimaryButton({ label, onPress, icon = "arrow.up.right", loading = false, disabled = false }: { label: string; onPress: () => void; icon?: SKIconName; loading?: boolean; disabled?: boolean }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: colors.primary },
        (pressed || disabled || loading) && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <IconSymbol name={icon} size={20} color="#FFFFFF" />}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, icon = "plus.circle.fill" }: { label: string; onPress: () => void; icon?: SKIconName }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.secondaryButton, { borderColor: colors.border }, pressed && styles.pressed]}
    >
      <IconSymbol name={icon} size={19} color={colors.primary} />
      <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

export function IconAction({ icon, label, onPress }: { icon: SKIconName; label: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.iconAction, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}
    >
      <IconSymbol name={icon} size={22} color={colors.primary} />
    </Pressable>
  );
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: { icon: SKIconName; title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={[styles.empty, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={[styles.emptyIcon, { backgroundColor: `${colors.primary}18` }]}>
        <IconSymbol name={icon} size={30} color={colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.emptyDescription, { color: colors.muted }]}>{description}</Text>
      {actionLabel && onAction ? <PrimaryButton label={actionLabel} onPress={onAction} icon="plus.circle.fill" /> : null}
    </View>
  );
}

export function LoadingState({ label = "Carregando seus dados..." }: { label?: string }) {
  const colors = useColors();
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

export function ErrorState({ description, onRetry }: { description: string; onRetry?: () => void }) {
  const colors = useColors();
  return (
    <View style={[styles.empty, { borderColor: colors.error, backgroundColor: colors.surface }]}>
      <View style={[styles.emptyIcon, { backgroundColor: `${colors.error}16` }]}>
        <IconSymbol name="exclamationmark.triangle.fill" size={28} color={colors.error} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Não foi possível carregar</Text>
      <Text style={[styles.emptyDescription, { color: colors.muted }]}>{description}</Text>
      {onRetry ? <SecondaryButton label="Tentar novamente" icon="arrow.clockwise" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 22, padding: 18, gap: 8, shadowColor: "#080D2B", shadowOpacity: 0.05, shadowRadius: 16, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  headerText: { flex: 1, gap: 3 },
  eyebrow: { fontSize: 12, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  headerTitle: { fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.5 },
  primaryButton: { minHeight: 52, borderRadius: 16, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondaryButton: { minHeight: 48, paddingHorizontal: 15, borderRadius: 15, borderWidth: 1, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  secondaryButtonText: { fontSize: 14, fontWeight: "800" },
  iconAction: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 15, borderWidth: 1 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  empty: { alignItems: "center", textAlign: "center", borderRadius: 24, borderWidth: 1, padding: 26, gap: 10 },
  emptyIcon: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginBottom: 3 },
  emptyTitle: { fontSize: 18, lineHeight: 23, fontWeight: "800", textAlign: "center" },
  emptyDescription: { fontSize: 14, lineHeight: 21, textAlign: "center", maxWidth: 290, marginBottom: 4 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 28 },
  loadingText: { fontSize: 14, fontWeight: "600" },
});
