import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Product } from "@/contexts/ProductContext";

interface ProductCardProps {
  product: Product;
  index: number;
}

const COLORS = {
  background: "#F5F0EB",
  foreground: "#3D3229",
  card: "#EDE6DF",
  cardForeground: "#3D3229",
  primary: "#B8734A",
  primaryForeground: "#F5F0EB",
  muted: "#E0D8CF",
  mutedForeground: "#8A7A6E",
  sage: "#A8C5A0",
  sageForeground: "#2D4A2A",
  rose: "#D4A0B0",
  roseForeground: "#5A2A3A",
  border: "#D5C9BC",
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop";

const ProductCard = ({ product, index }: ProductCardProps) => {
  const isPronta = product.categoria === "pronta";
  const badgeBg = isPronta ? COLORS.sage : COLORS.rose;
  const badgeText = isPronta ? COLORS.sageForeground : COLORS.roseForeground;

  return (
    <Link href={`/produto/${product.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <Image
          source={{ uri: product.imagemUrl || PLACEHOLDER_IMAGE }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeText }]}>
              {isPronta ? "Pronta Entrega" : "Sob Encomenda"}
            </Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {product.nome}
          </Text>
          <Text style={styles.price}>
            R$ {product.preco.toFixed(2).replace(".", ",")}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "Nunito",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "PlayfairDisplay",
    color: COLORS.foreground,
    marginTop: 8,
  },
  price: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "PlayfairDisplay",
    color: COLORS.primary,
    marginTop: 4,
  },
});

export default ProductCard;
