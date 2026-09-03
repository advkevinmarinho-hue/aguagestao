import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Card, IconAction, PageHeader, PrimaryButton, SecondaryButton } from "@/components/app-ui";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useWorkspace } from "@/hooks/use-workspace";
import { trpc } from "@/lib/trpc";

type ExitModeDraft = { key: string; name: string; price: string; consumption: string; active: boolean };
type ProductFormProps = { productId?: number };

const toCents = (value: string) => Math.round((Number(value.replace(/[^0-9,]/g, "").replace(",", ".")) || 0) * 100);
const fromCents = (value: number) => (value / 100).toFixed(2).replace(".", ",");

export function ProductForm({ productId }: ProductFormProps) {
  const colors = useColors();
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data } = useWorkspace();
  const product = data?.workspace?.products.find((item) => item.id === productId);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Galões de água");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [stock, setStock] = useState("");
  const [minimum, setMinimum] = useState("");
  const [active, setActive] = useState(true);
  const [modes, setModes] = useState<ExitModeDraft[]>([]);

  useEffect(() => {
    if (!product) return;
    setName(product.name); setCategory(product.category); setPrice(fromCents(product.defaultPriceCents)); setCost(fromCents(product.unitCostCents));
    setStock(String(product.stockUnits)); setMinimum(String(product.minimumStockUnits)); setActive(product.active);
    setModes(product.exitModes.map((mode) => ({ key: String(mode.id), name: mode.name, price: fromCents(mode.priceCents), consumption: String(mode.stockUnits), active: mode.active })));
  }, [product]);

  const invalidate = async () => utils.workspace.get.invalidate();
  const create = trpc.products.create.useMutation({ onSuccess: async () => { await invalidate(); router.replace("/produtos" as never); }, onError: (error) => Alert.alert("Não foi possível salvar", error.message) });
  const update = trpc.products.update.useMutation({ onSuccess: async () => { await invalidate(); router.back(); }, onError: (error) => Alert.alert("Não foi possível salvar", error.message) });
  const remove = trpc.products.remove.useMutation({ onSuccess: async (result) => { await invalidate(); Alert.alert(result.deactivated ? "Produto desativado" : "Produto apagado", result.deactivated ? "O histórico de vendas foi preservado." : "O produto e suas modalidades foram removidos."); router.replace("/produtos" as never); }, onError: (error) => Alert.alert("Não foi possível apagar", error.message) });

  const save = () => {
    const stockUnits = Number.parseInt(stock || "0", 10);
    const minimumStockUnits = Number.parseInt(minimum || "0", 10);
    if (name.trim().length < 2 || price.trim() === "" || cost.trim() === "" || !Number.isInteger(stockUnits) || stockUnits < 0 || !Number.isInteger(minimumStockUnits) || minimumStockUnits < 0) {
      Alert.alert("Revise os dados", "Informe nome, preço, custo e quantidades válidas."); return;
    }
    const exitModes = modes.map((mode) => ({ name: mode.name.trim(), priceCents: toCents(mode.price), stockUnits: Number.parseInt(mode.consumption, 10), active: mode.active }));
    if (exitModes.some((mode) => mode.name.length < 2 || mode.priceCents <= 0 || !Number.isInteger(mode.stockUnits) || mode.stockUnits < 1)) {
      Alert.alert("Revise as modalidades", "Cada modalidade precisa de nome, preço positivo e consumo de pelo menos um galão."); return;
    }
    const payload = { name: name.trim(), category: category.trim() || "Galões de água", defaultPriceCents: toCents(price), unitCostCents: toCents(cost), stockUnits, minimumStockUnits, active, exitModes };
    if (productId) update.mutate({ id: productId, product: payload }); else create.mutate(payload);
  };

  const confirmDelete = () => Alert.alert("Apagar produto?", "Se ele já tiver vendas, será desativado para preservar o histórico.", [{ text: "Cancelar", style: "cancel" }, { text: "Apagar", style: "destructive", onPress: () => productId && remove.mutate({ id: productId }) }]);
  const addMode = () => setModes((current) => [...current, { key: `new-${Date.now()}`, name: "", price: price || "", consumption: "1", active: true }]);
  const updateMode = (key: string, patch: Partial<ExitModeDraft>) => setModes((current) => current.map((mode) => mode.key === key ? { ...mode, ...patch } : mode));

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.topRow}><IconAction icon="chevron.left" label="Voltar" onPress={() => router.back()} /><PageHeader eyebrow="Produtos" title={productId ? "Editar estoque" : "Novo estoque"} /></View>
      <Card><Text style={[styles.cardTitle, { color: colors.foreground }]}>Dados do galão</Text><FormField label="Nome do estoque" value={name} onChangeText={setName} placeholder="Ex.: Galão de 20 litros" colors={colors} /><FormField label="Categoria" value={category} onChangeText={setCategory} placeholder="Galões de água" colors={colors} /><View style={styles.twoFields}><View style={styles.half}><FormField label="Preço padrão" value={price} onChangeText={setPrice} placeholder="0,00" prefix="R$" keyboardType="decimal-pad" colors={colors} /></View><View style={styles.half}><FormField label="Custo por galão" value={cost} onChangeText={setCost} placeholder="0,00" prefix="R$" keyboardType="decimal-pad" colors={colors} /></View></View><View style={styles.twoFields}><View style={styles.half}><FormField label="Galões disponíveis" value={stock} onChangeText={setStock} placeholder="0" keyboardType="number-pad" colors={colors} /></View><View style={styles.half}><FormField label="Estoque mínimo" value={minimum} onChangeText={setMinimum} placeholder="0" keyboardType="number-pad" colors={colors} /></View></View><View style={styles.switchRow}><View><Text style={[styles.label, { color: colors.foreground }]}>Disponível para venda</Text><Text style={[styles.helper, { color: colors.muted }]}>Produtos inativos seguem nos relatórios.</Text></View><Switch value={active} onValueChange={setActive} trackColor={{ false: colors.border, true: colors.primary }} /></View></Card>
      <Card><View style={styles.modeTitle}><View><Text style={[styles.cardTitle, { color: colors.foreground }]}>Formas de saída</Text><Text style={[styles.helper, { color: colors.muted }]}>Todas usam o mesmo estoque de galões.</Text></View><IconSymbol name="drop.fill" size={22} color={colors.primary} /></View>{modes.length === 0 ? <Text style={[styles.autoMode, { color: colors.muted }]}>Sem modalidades extras, uma “Venda padrão” de 1 galão será criada automaticamente.</Text> : <FlatList data={modes} scrollEnabled={false} keyExtractor={(item) => item.key} ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />} renderItem={({ item }) => <View style={styles.modeForm}><View style={styles.modeLine}><Text style={[styles.modeName, { color: colors.foreground }]}>Modalidade</Text><Pressable onPress={() => setModes((current) => current.filter((mode) => mode.key !== item.key))} style={({ pressed }) => [styles.removeMode, pressed && styles.pressed]}><IconSymbol name="trash" size={18} color={colors.error} /></Pressable></View><FormField label="Nome" value={item.name} onChangeText={(value) => updateMode(item.key, { name: value })} placeholder="Ex.: Troca com vasilhame" colors={colors} /><View style={styles.twoFields}><View style={styles.half}><FormField label="Preço" value={item.price} onChangeText={(value) => updateMode(item.key, { price: value })} placeholder="0,00" prefix="R$" keyboardType="decimal-pad" colors={colors} /></View><View style={styles.half}><FormField label="Consome" value={item.consumption} onChangeText={(value) => updateMode(item.key, { consumption: value })} placeholder="1" suffix="galão(ões)" keyboardType="number-pad" colors={colors} /></View></View></View>} />}</Card>
      <SecondaryButton label="Adicionar forma de saída" icon="plus.circle.fill" onPress={addMode} />
      <PrimaryButton label={productId ? "Salvar alterações" : "Cadastrar estoque"} icon="checkmark.circle.fill" onPress={save} loading={create.isPending || update.isPending} />
      {productId ? <Pressable onPress={confirmDelete} disabled={remove.isPending} style={({ pressed }) => [styles.deleteButton, { borderColor: colors.error }, pressed && styles.pressed]}><IconSymbol name="trash" size={19} color={colors.error} /><Text style={[styles.deleteText, { color: colors.error }]}>{remove.isPending ? "Apagando..." : "Apagar produto"}</Text></Pressable> : null}
    </ScrollView>
  );
}

function FormField({ label, prefix, suffix, colors, ...props }: { label: string; prefix?: string; suffix?: string; colors: ReturnType<typeof useColors>; value: string; onChangeText: (text: string) => void; placeholder: string; keyboardType?: "default" | "decimal-pad" | "number-pad" }) {
  return <View style={styles.field}><Text style={[styles.label, { color: colors.foreground }]}>{label}</Text><View style={[styles.inputWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>{prefix ? <Text style={[styles.affix, { color: colors.muted }]}>{prefix}</Text> : null}<TextInput {...props} style={[styles.input, { color: colors.foreground }]} placeholderTextColor={colors.muted} returnKeyType="done" />{suffix ? <Text style={[styles.suffix, { color: colors.muted }]}>{suffix}</Text> : null}</View></View>;
}

const styles = StyleSheet.create({
  content: { gap: 15, padding: 16, paddingBottom: 38 }, topRow: { flexDirection: "row", alignItems: "center", gap: 12 }, cardTitle: { fontSize: 18, fontWeight: "800" }, field: { gap: 7, marginTop: 8 }, label: { fontSize: 12, fontWeight: "800" }, helper: { fontSize: 12, lineHeight: 17, marginTop: 2 }, inputWrap: { height: 49, borderWidth: 1, borderRadius: 13, flexDirection: "row", alignItems: "center", paddingHorizontal: 12 }, input: { flex: 1, height: "100%", fontSize: 15, fontWeight: "600" }, affix: { fontSize: 14, fontWeight: "800", marginRight: 6 }, suffix: { fontSize: 11, fontWeight: "700", marginLeft: 4 }, twoFields: { flexDirection: "row", gap: 10 }, half: { flex: 1 }, switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 15, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#CFE0EA" }, modeTitle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, autoMode: { fontSize: 13, lineHeight: 19, marginTop: 7 }, modeForm: { paddingVertical: 14 }, modeLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, modeName: { fontSize: 14, fontWeight: "800" }, removeMode: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" }, separator: { height: StyleSheet.hairlineWidth }, deleteButton: { minHeight: 50, borderWidth: 1, borderRadius: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }, deleteText: { fontSize: 15, fontWeight: "800" }, pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
