import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Card, EmptyState, IconAction, LoadingState, PageHeader, PrimaryButton } from "@/components/app-ui";
import { BrandMark } from "@/components/brand-mark";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useWorkspace } from "@/hooks/use-workspace";
import { calculateMetrics, formatBRL } from "@/shared/business";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { data, isLoading } = useWorkspace();
  const workspace = data?.workspace;

  const todayMetrics = useMemo(() => {
    if (!workspace) return null;
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return calculateMetrics(workspace.products, workspace.sales, workspace.saleItems, workspace.financialEntries, { start, end });
  }, [workspace]);

  const allMetrics = useMemo(() => workspace ? calculateMetrics(workspace.products, workspace.sales, workspace.saleItems, workspace.financialEntries) : null, [workspace]);

  if (isLoading || !workspace || !allMetrics || !todayMetrics) return <ScreenContainer><LoadingState /></ScreenContainer>;
  const hasSales = workspace.sales.length > 0;
  const monthRevenue = calculateMetrics(workspace.products, workspace.sales, workspace.saleItems, workspace.financialEntries, { start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) }).revenueCents;
  const goalProgress = workspace.business.monthlyGoalCents > 0 ? Math.min(1, monthRevenue / workspace.business.monthlyGoalCents) : null;

  return (
    <ScreenContainer className="px-4">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.identity}><BrandMark size={40} /><View><Text style={[styles.businessName, { color: colors.foreground }]}>{workspace.business.name}</Text><Text style={[styles.kicker, { color: colors.muted }]}>gestão do dia</Text></View></View>
          <IconAction icon="person.crop.circle" label="Abrir perfil" onPress={() => router.push("/perfil" as never)} />
        </View>

        <PageHeader eyebrow="Início" title="Olá, vamos cuidar do caixa." />
        <Card style={[styles.revenueCard, { backgroundColor: colors.foreground, borderColor: colors.foreground }]}>
          <View style={styles.revenueHeader}><Text style={styles.revenueLabel}>FATURAMENTO DE HOJE</Text><IconSymbol name="drop.fill" color="#7BC5F4" size={22} /></View>
          <Text style={styles.revenueValue}>{formatBRL(todayMetrics.revenueCents)}</Text>
          <Text style={styles.revenueDescription}>{todayMetrics.salesCount === 0 ? "Os números aparecem depois da primeira venda." : `${todayMetrics.salesCount} venda${todayMetrics.salesCount > 1 ? "s" : ""} registrada${todayMetrics.salesCount > 1 ? "s" : ""} hoje.`}</Text>
        </Card>

        <View style={styles.quickGrid}>
          <PrimaryButton label="Vender" icon="cart.fill" onPress={() => router.push("/vender" as never)} />
          <View style={styles.quickSecondary}><Text style={[styles.quickLabel, { color: colors.foreground }]}>Movimente o negócio</Text><View style={styles.quickActions}><IconAction icon="banknote.fill" label="Lançar gasto" onPress={() => router.push("/lancamento/novo" as never)} /><IconAction icon="shippingbox.fill" label="Cadastrar estoque" onPress={() => router.push("/produto/novo" as never)} /></View></View>
        </View>

        {hasSales ? <View style={styles.metricGrid}>
          <SmallMetric label="Caixa atual" value={formatBRL(allMetrics.cashCents)} icon="banknote.fill" colors={colors} />
          <SmallMetric label="Margem líquida" value={allMetrics.netMargin === null ? "—" : `${Math.round(allMetrics.netMargin * 100)}%`} icon="chart.bar.fill" colors={colors} />
          <SmallMetric label="Reserva" value={formatBRL(allMetrics.reserveCents)} icon="lock.fill" colors={colors} />
          <SmallMetric label="Estoque baixo" value={`${allMetrics.lowStockCount} item${allMetrics.lowStockCount === 1 ? "" : "s"}`} icon="exclamationmark.triangle.fill" colors={colors} warning={allMetrics.lowStockCount > 0} />
        </View> : <EmptyState icon="cart.fill" title="Registre sua primeira venda" description="Cadastre um galão e registre as saídas para enxergar caixa, margem e progresso." actionLabel={workspace.products.length ? "Ir para vender" : "Cadastrar estoque"} onAction={() => router.push((workspace.products.length ? "/vender" : "/produto/novo") as never)} />}

        <Card style={styles.goalCard}>
          <View style={styles.goalHeading}><View><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Meta mensal</Text><Text style={[styles.sectionDescription, { color: colors.muted }]}>{goalProgress === null ? "Defina uma meta no perfil quando desejar." : `${Math.round(goalProgress * 100)}% do objetivo alcançado`}</Text></View><IconSymbol name="chart.bar.fill" size={23} color={colors.primary} /></View>
          {goalProgress !== null ? <><View style={[styles.progressTrack, { backgroundColor: colors.border }]}><View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${goalProgress * 100}%` }]} /></View><Text style={[styles.goalValue, { color: colors.foreground }]}>{formatBRL(monthRevenue)} de {formatBRL(workspace.business.monthlyGoalCents)}</Text></> : <Text style={[styles.goalValue, { color: colors.muted }]}>Você pode acompanhar a evolução assim que definir uma meta.</Text>}
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

function SmallMetric({ label, value, icon, colors, warning = false }: { label: string; value: string; icon: "banknote.fill" | "chart.bar.fill" | "lock.fill" | "exclamationmark.triangle.fill"; colors: ReturnType<typeof useColors>; warning?: boolean }) {
  return <Card style={styles.metricCard}><IconSymbol name={icon} size={19} color={warning ? colors.warning : colors.primary} /><Text style={[styles.metricLabel, { color: colors.muted }]}>{label}</Text><Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text></Card>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12, paddingBottom: 38, gap: 18 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  identity: { flexDirection: "row", alignItems: "center", gap: 10 },
  businessName: { fontSize: 15, lineHeight: 20, fontWeight: "800", maxWidth: 245 },
  kicker: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  revenueCard: { gap: 10, padding: 21 },
  revenueHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  revenueLabel: { fontSize: 11, color: "#BCE7FA", fontWeight: "800", letterSpacing: 0.9 },
  revenueValue: { color: "#FFFFFF", fontWeight: "800", fontSize: 35, letterSpacing: -1, lineHeight: 43 },
  revenueDescription: { color: "#CFE0EA", fontSize: 13, lineHeight: 19, fontWeight: "600" },
  quickGrid: { gap: 10 },
  quickSecondary: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4 },
  quickLabel: { fontSize: 14, fontWeight: "700" },
  quickActions: { flexDirection: "row", gap: 8 },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metricCard: { width: "48.5%", minHeight: 117, justifyContent: "space-between", gap: 5 },
  metricLabel: { fontSize: 12, fontWeight: "700", marginTop: 5 },
  metricValue: { fontSize: 17, lineHeight: 22, fontWeight: "800", letterSpacing: -0.2 },
  goalCard: { gap: 13 },
  goalHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 17, fontWeight: "800" },
  sectionDescription: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  progressTrack: { height: 8, borderRadius: 999, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 999 },
  goalValue: { fontSize: 13, fontWeight: "700" },
});
