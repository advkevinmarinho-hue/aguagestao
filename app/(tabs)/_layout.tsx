import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppGate } from "@/components/app-gate";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  const tabBarHeight = 61 + bottomPadding;
  return (
    <AppGate>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarButton: HapticTab,
          tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2 },
          tabBarStyle: { height: tabBarHeight, paddingTop: 7, paddingBottom: bottomPadding, backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1 },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Início", tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} /> }} />
        <Tabs.Screen name="vender" options={{ title: "Vender", tabBarIcon: ({ color }) => <IconSymbol name="cart.fill" size={24} color={color} /> }} />
        <Tabs.Screen name="produtos" options={{ title: "Produtos", tabBarIcon: ({ color }) => <IconSymbol name="shippingbox.fill" size={24} color={color} /> }} />
        <Tabs.Screen name="financas" options={{ title: "Finanças", tabBarIcon: ({ color }) => <IconSymbol name="chart.bar.fill" size={24} color={color} /> }} />
        <Tabs.Screen name="aprender" options={{ title: "Aprender", tabBarIcon: ({ color }) => <IconSymbol name="graduationcap.fill" size={24} color={color} /> }} />
      </Tabs>
    </AppGate>
  );
}
