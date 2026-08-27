import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "cart.fill": "shopping-cart",
  "shippingbox.fill": "inventory-2",
  "chart.bar.fill": "bar-chart",
  "graduationcap.fill": "school",
  "drop.fill": "water-drop",
  "plus.circle.fill": "add-circle",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "arrow.up.right": "north-east",
  "arrow.down.right": "south-east",
  "exclamationmark.triangle.fill": "warning",
  "checkmark.circle.fill": "check-circle",
  "banknote.fill": "payments",
  "creditcard.fill": "credit-card",
  "slider.horizontal.3": "tune",
  "ellipsis": "more-horiz",
  "xmark": "close",
  "pencil": "edit",
  "trash": "delete-outline",
  "arrow.clockwise": "refresh",
  "doc.text.fill": "description",
  "printer.fill": "print",
  "person.crop.circle": "account-circle",
  "lock.fill": "lock",
  "info.circle.fill": "info",
} as IconMapping;

export type SKIconName = IconSymbolName;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
