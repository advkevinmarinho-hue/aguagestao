import { useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ProductForm } from "@/components/product-form";
export default function ProductDetailScreen() { const { id } = useLocalSearchParams<{ id: string }>(); return <ScreenContainer><ProductForm productId={Number(id)} /></ScreenContainer>; }
