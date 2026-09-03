import { useMemo } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card, IconAction, PrimaryButton } from "@/components/app-ui";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { learningTracks } from "@/shared/learning";

export default function LearningLessonScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = useMemo(() => learningTracks.find((item) => item.id === id), [id]);
  const progress = trpc.learning.progress.useQuery();
  const utils = trpc.useUtils();
  const complete = trpc.learning.complete.useMutation({ onSuccess: async () => { await utils.learning.progress.invalidate(); Alert.alert("Lição concluída", "Seu progresso foi salvo na sua conta.", [{ text: "Voltar para a trilha", onPress: () => router.replace("/aprender" as never) }]); }, onError: (error) => Alert.alert("Não foi possível salvar", error.message) });

  if (!lesson) return <ScreenContainer className="p-4"><Text style={[styles.title, { color: colors.foreground }]}>Lição não encontrada</Text></ScreenContainer>;
  const isDone = Boolean(progress.data?.some((item) => item.lessonKey === lesson.id));
  return <ScreenContainer edges={["top", "bottom", "left", "right"]}><ScrollView contentContainerStyle={styles.content}><View style={styles.top}><IconAction icon="chevron.left" label="Voltar" onPress={() => router.back()} /><View style={[styles.lessonNumber, { backgroundColor: colors.foreground }]}><Text style={styles.lessonNumberText}>{lesson.order}</Text></View></View><Text style={[styles.eyebrow, { color: colors.primary }]}>LIÇÃO {lesson.order} · {lesson.durationMinutes} MINUTOS</Text><Text style={[styles.title, { color: colors.foreground }]}>{lesson.title}</Text><Text style={[styles.objective, { color: colors.muted }]}>{lesson.objective}</Text><Card style={[styles.actionCard, { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}34` }]}><IconSymbol name="drop.fill" size={23} color={colors.primary} /><Text style={[styles.actionTitle, { color: colors.foreground }]}>Faça com os dados da sua distribuidora</Text><Text style={[styles.actionText, { color: colors.muted }]}>{lesson.action}</Text></Card><Text style={[styles.section, { color: colors.foreground }]}>Entenda</Text>{lesson.sections.map((section) => <Card key={section.title} style={styles.sectionCard}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text><Text style={[styles.body, { color: colors.muted }]}>{section.body}</Text></Card>)}<Card style={[styles.practiceCard, { backgroundColor: colors.foreground, borderColor: colors.foreground }]}><View style={styles.practiceHeader}><IconSymbol name="checkmark.circle.fill" size={21} color="#BCE7FA" /><Text style={styles.practiceLabel}>PENSE NA PRÁTICA</Text></View><Text style={styles.practiceText}>{lesson.practice}</Text></Card><PrimaryButton label={isDone ? "Lição concluída" : "Marcar como concluída"} icon={isDone ? "checkmark.circle.fill" : "checkmark"} onPress={() => !isDone && complete.mutate({ lessonKey: lesson.id })} loading={complete.isPending} /></ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { padding: 16, paddingBottom: 40, gap: 12 }, top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, lessonNumber: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" }, lessonNumberText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" }, eyebrow: { fontSize: 10, letterSpacing: 1, fontWeight: "800", marginTop: 8 }, title: { fontSize: 29, lineHeight: 35, fontWeight: "800", letterSpacing: -0.5 }, objective: { fontSize: 15, lineHeight: 22, fontWeight: "600", marginBottom: 4 }, actionCard: { gap: 7, padding: 16 }, actionTitle: { fontSize: 15, fontWeight: "800" }, actionText: { fontSize: 13, lineHeight: 19, fontWeight: "600" }, section: { fontSize: 18, fontWeight: "800", marginTop: 6 }, sectionCard: { gap: 6, padding: 15 }, sectionTitle: { fontSize: 15, fontWeight: "800" }, body: { fontSize: 13, lineHeight: 20, fontWeight: "600" }, practiceCard: { gap: 10, padding: 17, marginTop: 4 }, practiceHeader: { flexDirection: "row", alignItems: "center", gap: 8 }, practiceLabel: { color: "#BCE7FA", fontSize: 10, letterSpacing: 1, fontWeight: "800" }, practiceText: { color: "#FFFFFF", fontSize: 16, lineHeight: 23, fontWeight: "700" } });
