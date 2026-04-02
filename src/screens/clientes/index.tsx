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
import { useRouter } from "expo-router";
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
  rose: "#D4A0B0",
  red: "#f38ba8",
};

const Clients = () => {
  const router = useRouter();
  const { clients, addClient, verifyPassword, adminUnlocked, setAdminUnlocked } = useProducts();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNotifications, setAcceptNotifications] = useState(false);
  const [submittingClient, setSubmittingClient] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleClientSubmit = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Erro", "Preencha nome, email e telefone.");
      return;
    }
    if (!acceptTerms) {
      Alert.alert("Erro", "Aceite os termos de uso para continuar.");
      return;
    }
    try {
      setSubmittingClient(true);
      await addClient({ nome: name, email: email, telefone: phone });
      Alert.alert("Sucesso", "Cliente cadastrado!");
      setName("");
      setEmail("");
      setPhone("");
      setAcceptTerms(false);
      setAcceptNotifications(false);
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar o cliente.");
    } finally {
      setSubmittingClient(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!adminEmail || !adminPassword) {
      Alert.alert("Erro", "Preencha email e senha.");
      return;
    }
    try {
      setVerifying(true);
      const valid = await verifyPassword(adminEmail, adminPassword);
      if (valid) {
        setAdminUnlocked(true);
        Alert.alert("Sucesso", "Acesso liberado!");
      } else {
        Alert.alert("Erro", "Email ou senha incorretos.");
      }
    } catch {
      Alert.alert("Erro", "Não foi possível verificar as credenciais.");
    } finally {
      setVerifying(false);
    }
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setAdminUnlocked(false);
      setAdminEmail("");
      setAdminPassword("");
    } else {
      setIsAdmin(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro</Text>
        {adminUnlocked && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              setAdminUnlocked(false);
              setIsAdmin(false);
              setAdminEmail("");
              setAdminPassword("");
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        )}
      </View>

      {isAdmin && adminUnlocked ? (
        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.clientsScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.clientsSection}>
            <Text style={styles.clientsTitle}>Contatos Cadastrados</Text>
            {clients.length === 0 ? (
              <Text style={styles.noClientsText}>Nenhum cliente cadastrado.</Text>
            ) : (
              clients.map((client) => (
                <View key={client.id} style={styles.clientCard}>
                  <View style={styles.clientAvatar}>
                    <Text style={styles.clientAvatarText}>
                      {client.nome.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName} numberOfLines={1}>
                      {client.nome}
                    </Text>
                    <View style={styles.phoneRow}>
                      <Ionicons name="call-outline" size={12} color={COLORS.mutedForeground} />
                      <Text style={styles.clientPhone}>{client.telefone}</Text>
                    </View>
                    <View style={styles.emailRow}>
                      <Ionicons name="mail-outline" size={12} color={COLORS.mutedForeground} />
                      <Text style={styles.clientEmail} numberOfLines={1}>
                        {client.email}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!isAdmin && (
            <View style={styles.formWrapper}>
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telefone / WhatsApp"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                <TouchableOpacity
                  style={[styles.submitButton, submittingClient && styles.submitButtonDisabled]}
                  onPress={handleClientSubmit}
                  disabled={submittingClient}
                  activeOpacity={0.8}
                >
                  {submittingClient ? (
                    <ActivityIndicator color={COLORS.secondaryForeground} />
                  ) : (
                    <>
                      <Ionicons name="person-add-outline" size={18} color={COLORS.secondaryForeground} />
                      <Text style={styles.submitButtonText}>Cadastrar Cliente</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
                    {acceptTerms && <Ionicons name="checkmark" size={12} color={COLORS.primaryForeground} />}
                  </View>
                  <Text style={styles.checkboxLabel}>Aceito os termos de uso</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setAcceptNotifications(!acceptNotifications)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, acceptNotifications && styles.checkboxActive]}>
                    {acceptNotifications && <Ionicons name="checkmark" size={12} color={COLORS.primaryForeground} />}
                  </View>
                  <Text style={styles.checkboxLabel}>Receber notificação de novas peças no email</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {isAdmin && !adminUnlocked && (
            <View style={styles.adminSection}>
              <View style={styles.lockRow}>
                <Ionicons name="lock-closed-outline" size={16} color={COLORS.mutedForeground} />
                <Text style={styles.lockText}>Login de administrador</Text>
              </View>
              <TextInput
                style={styles.adminInput}
                placeholder="Email"
                placeholderTextColor={COLORS.mutedForeground}
                value={adminEmail}
                onChangeText={setAdminEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.adminInput}
                placeholder="Senha"
                placeholderTextColor={COLORS.mutedForeground}
                secureTextEntry
                value={adminPassword}
                onChangeText={setAdminPassword}
              />
              <TouchableOpacity
                style={[styles.unlockButton, verifying && styles.submitButtonDisabled]}
                onPress={handlePasswordSubmit}
                disabled={verifying}
                activeOpacity={0.8}
              >
                {verifying ? (
                  <ActivityIndicator color={COLORS.primaryForeground} />
                ) : (
                  <Text style={styles.unlockButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {!adminUnlocked && (
            <TouchableOpacity
              style={styles.adminToggle}
              onPress={handleAdminToggle}
              activeOpacity={0.7}
            >
              <View style={[styles.adminCheckbox, isAdmin && styles.adminCheckboxActive]}>
                {isAdmin && <Ionicons name="checkmark" size={12} color={COLORS.primaryForeground} />}
              </View>
              <Text style={styles.adminToggleText}>Sou administrador</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {isAdmin && adminUnlocked && (
        <TouchableOpacity
          style={styles.floatingAdminButton}
          onPress={() => router.push("/admin")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={COLORS.primaryForeground} />
        </TouchableOpacity>
      )}
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "PlayfairDisplay",
    color: COLORS.foreground,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: "800",
    fontFamily: "Nunito",
    color: COLORS.red,
  },
  main: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  clientsScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  formWrapper: {
    width: "100%",
    maxWidth: 400,
    justifyContent: "center",
  },
  form: {
    gap: 12,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  adminInput: {
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
    marginBottom: 12,
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
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
    color: COLORS.secondaryForeground,
  },
  adminToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 12,
    opacity: 0.5,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.mutedForeground,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 13,
    fontFamily: "Nunito",
    color: COLORS.foreground,
    flex: 1,
  },
  adminCheckbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.mutedForeground,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  adminCheckboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  adminToggleText: {
    fontSize: 12,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
  },
  adminSection: {
    gap: 0,
    marginTop: 16,
    width: "100%",
    maxWidth: 400,
  },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  lockText: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
  },
  unlockButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    marginTop: 12,
  },
  unlockButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito",
    color: COLORS.primaryForeground,
  },
  floatingAdminButton: {
    position: "absolute",
    bottom: 20,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 50,
  },
  noClientsText: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
    textAlign: "center",
    marginTop: 24,
  },
  clientsSection: {
    marginTop: 24,
    gap: 12,
    width: "100%",
    maxWidth: 400,
  },
  clientsTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "PlayfairDisplay",
    color: COLORS.foreground,
    marginBottom: 8,
  },
  clientCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.rose,
    alignItems: "center",
    justifyContent: "center",
  },
  clientAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito",
    color: COLORS.foreground,
  },
  clientInfo: {
    flex: 1,
    minWidth: 0,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Nunito",
    color: COLORS.foreground,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  clientPhone: {
    fontSize: 12,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  clientEmail: {
    fontSize: 12,
    fontFamily: "Nunito",
    color: COLORS.mutedForeground,
  },
});

export default Clients;
