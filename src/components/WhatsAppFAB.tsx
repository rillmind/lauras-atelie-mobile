import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

const WHATSAPP_NUMBER = "5587996787856";

const COLORS = {
  whatsapp: "#25D366",
  whatsappForeground: "#FFFFFF",
};

const WhatsAppFAB = () => {
  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Vim pelo app do Laura's Ateliê e gostaria de saber mais sobre as peças.`;
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleClick}
      activeOpacity={0.8}
      accessibilityLabel="Contato via WhatsApp"
    >
      <Ionicons name="logo-whatsapp" size={28} color={COLORS.whatsappForeground} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.whatsapp,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 50,
  },
});

export default WhatsAppFAB;
