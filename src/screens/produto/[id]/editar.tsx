import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProducts } from "@/contexts/ProductContext";

const COLORS = {
  background: "#F5F0EB",
  foreground: "#3D3229",
  card: "#EDE6DF",
  primary: "#B8734A",
  primaryForeground: "#F5F0EB",
  secondary: "#D4A0B0",
  secondaryForeground: "#5A2A3A",
  muted: "#E0D8CF",
  mutedForeground: "#8A7A6E",
  border: "#D5C9BC",
};

const EditProduct = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProduct, editProduct } = useProducts();
  const product = getProduct(id ? parseInt(id) : 0);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "pronta" as "pronta" | "encomenda",
    materiais: "",
    dimensoes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        nome: product.nome,
        descricao: product.descricao || "",
        preco: product.preco.toString(),
        categoria: product.categoria,
        materiais: product.materiais?.join(", ") || "",
        dimensoes: product.dimensoes || "",
      });
    }
  }, [product]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Produto não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = async () => {
    if (!form.nome || !form.preco) {
      Alert.alert("Erro", "Preencha ao menos o nome e o preço.");
      return;
    }
    try {
      setSubmitting(true);
      await editProduct(product.id, {
        nome: form.nome,
        descricao: form.descricao || null,
        preco: parseFloat(form.preco),
        categoria: form.categoria,
        materiais: form.materiais.split(",").map((m) => m.trim()).filter(Boolean),
        dimensoes: form.dimensoes || null,
      });
      Alert.alert("Sucesso", "Peça atualizada com sucesso!");
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar a peça.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={COLORS.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Peça</Text>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.field}>
          <Text style={styles.label}>Nome da Peça *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Ursinho Amigurumi"
            placeholderTextColor={COLORS.mutedForeground}
            value={form.nome}
            onChangeText={(text) => setForm({ ...form, nome: text })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Descreva a peça..."
            placeholderTextColor={COLORS.mutedForeground}
            value={form.descricao}
            onChangeText={(text) => setForm({ ...form, descricao: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Preço (R$) *</Text>
            <TextInput
              style={styles.input}
              placeholder="89,90"
              placeholderTextColor={COLORS.mutedForeground}
              keyboardType="decimal-pad"
              value={form.preco}
              onChangeText={(text) => setForm({ ...form, preco: text })}
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.pickerOption, form.categoria === "pronta" && styles.pickerOptionActive]}
                onPress={() => setForm({ ...form, categoria: "pronta" })}
              >
                <Text style={[styles.pickerText, form.categoria === "pronta" && styles.pickerTextActive]}>
                  Peça Pronta
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerOption, form.categoria === "encomenda" && styles.pickerOptionActive]}
                onPress={() => setForm({ ...form, categoria: "encomenda" })}
              >
                <Text style={[styles.pickerText, form.categoria === "encomenda" && styles.pickerTextActive]}>
                  Encomenda
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Materiais (separados por vírgula)</Text>
          <TextInput
            style={styles.input}
            placeholder="Fio de algodão, Enchimento"
            placeholderTextColor={COLORS.mutedForeground}
            value={form.materiais}
            onChangeText={(text) => setForm({ ...form, materiais: text })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Dimensões</Text>
          <TextInput
            style={styles.input}
            placeholder="25cm x 15cm"
            placeholderTextColor={COLORS.mutedForeground}
            value={form.dimensoes}
            onChangeText={(text) => setForm({ ...form, dimensoes: text })}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.primaryForeground} />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color={COLORS.primaryForeground} />
              <Text style={styles.submitButtonText}>Salvar Alterações</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "PlayfairDisplay",
    color: COLORS.foreground,
  },
  main: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.muted,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.foreground,
    fontFamily: "Nunito",
    fontSize: 14,
  },
  textarea: {
    minHeight: 100,
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.muted,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  pickerOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pickerText: {
    fontSize: 13,
    fontFamily: "Nunito",
    color: COLORS.foreground,
  },
  pickerTextActive: {
    color: COLORS.primaryForeground,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
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

export default EditProduct;
