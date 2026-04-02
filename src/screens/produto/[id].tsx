import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProducts } from "@/contexts/ProductContext";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import * as Linking from "expo-linking";

const COLORS = {
  background: "#F5F0EB",
  foreground: "#3D3229",
  card: "#EDE6DF",
  primary: "#B8734A",
  primaryForeground: "#F5F0EB",
  muted: "#E0D8CF",
  mutedForeground: "#8A7A6E",
  sage: "#A8C5A0",
  sageForeground: "#2D4A2A",
  rose: "#D4A0B0",
  roseForeground: "#5A2A3A",
  border: "#D5C9BC",
  honey: "#D4A050",
  destructive: "#DC3545",
};

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProduct, loading, adminUnlocked, deleteProduct } = useProducts();
  const product = getProduct(id ? parseInt(id) : 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonInner}>
            <Ionicons name="arrow-back" size={20} color={COLORS.foreground} />
          </View>
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Produto não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPronta = product.categoria === "pronta";
  const badgeBg = isPronta ? COLORS.sage : COLORS.rose;
  const badgeText = isPronta ? COLORS.sageForeground : COLORS.roseForeground;

  const handleWhatsApp = () => {
    const message = `Olá! Tenho interesse na peça "${product.nome}" (R$ ${product.preco.toFixed(2).replace(".", ",")}).`;
    const url = `https://wa.me/5587996787856?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir Peça",
      `Tem certeza que deseja excluir "${product.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteProduct(product.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonInner}>
            <Ionicons name="arrow-back" size={20} color={COLORS.foreground} />
          </View>
        </TouchableOpacity>

        {adminUnlocked && (
          <View style={styles.adminButtons}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: COLORS.primary }]}
              onPress={() => router.push(`/produto/${product.id}/editar` as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.primaryForeground} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: COLORS.destructive }]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.primaryForeground} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.imagemUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop" }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeText }]}>
              {isPronta ? "Pronta Entrega" : "Sob Encomenda"}
            </Text>
          </View>

          <Text style={styles.title}>{product.nome}</Text>
          <Text style={styles.price}>
            R$ {product.preco.toFixed(2).replace(".", ",")}
          </Text>
          <Text style={styles.description}>{product.descricao}</Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="layers-outline" size={16} color={COLORS.honey} />
              <Text style={styles.sectionTitle}>Materiais</Text>
            </View>
            <View style={styles.materials}>
              {product.materiais?.map((m, i) => (
                <View key={i} style={styles.materialTag}>
                  <Text style={styles.materialText}>{m}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="resize-outline" size={16} color={COLORS.honey} />
              <Text style={styles.sectionTitle}>Dimensões</Text>
            </View>
            <Text style={styles.dimensionsText}>{product.dimensoes}</Text>
          </View>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleWhatsApp}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Tenho Interesse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <WhatsAppFAB />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtons: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 30,
  },
  backButton: {
    zIndex: 30,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adminButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  image: {
    width: "100%",
    height: 400,
  },
  content: {
    marginTop: -24,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Nunito",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "PlayfairDisplay",
    color: COLORS.foreground,
    marginTop: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "PlayfairDisplay",
    color: COLORS.primary,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
    lineHeight: 22,
    marginTop: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "PlayfairDisplay",
    color: COLORS.foreground,
  },
  materials: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  materialTag: {
    backgroundColor: COLORS.muted,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  materialText: {
    fontSize: 12,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
  },
  dimensionsText: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
  },
  ctaButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito",
    color: COLORS.primaryForeground,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
  },
});

export default ProductDetail;
