import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#F5F0EB",
  foreground: "#3D3229",
  card: "#EDE6DF",
  primary: "#B8734A",
  mutedForeground: "#8A7A6E",
  border: "#D5C9BC",
  honey: "#D4A050",
  rose: "#D4A0B0",
};

const Index = () => {
  const { products, loading, error, refresh } = useProducts();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const prontas = products.filter((p) => p.categoria === "pronta");
  const encomendas = products.filter((p) => p.categoria === "encomenda");

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.mutedForeground} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh} activeOpacity={0.8}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.title}>Laura's Ateliê</Text>
          <Text style={styles.subtitle}>Crochê feito com amor</Text>
        </View>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.accentBar, { backgroundColor: COLORS.honey }]} />
            <Text style={styles.sectionTitle}>Peças Prontas</Text>
          </View>
          {prontas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma peça pronta no momento.</Text>
          ) : (
            <View style={styles.grid}>
              {prontas.map((product, i) => (
                <View key={product.id} style={styles.gridItem}>
                  <ProductCard product={product} index={i} />
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.accentBar, { backgroundColor: COLORS.rose }]} />
            <Text style={styles.sectionTitle}>Sob Encomenda</Text>
          </View>
          {encomendas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma peça sob encomenda no momento.</Text>
          ) : (
            <View style={styles.grid}>
              {encomendas.map((product, i) => (
                <View key={product.id} style={styles.gridItem}>
                  <ProductCard product={product} index={i} />
                </View>
              ))}
            </View>
          )}
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
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "PlayfairDisplay",
    color: COLORS.foreground,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
  },
  main: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  accentBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "PlayfairDisplay",
    color: COLORS.foreground,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
    textAlign: "center",
    paddingVertical: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
    textAlign: "center",
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito",
    color: COLORS.background,
  },
});

export default Index;
