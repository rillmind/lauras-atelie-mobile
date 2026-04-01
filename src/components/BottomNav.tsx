import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  card: "#EDE6DF",
  primary: "#B8734A",
  mutedForeground: "#8A7A6E",
  border: "#D5C9BC",
};

const navItems = [
  { icon: "home-outline" as const, label: "Início", path: "/" },
  { icon: "people-outline" as const, label: "Cadastro", path: "/clientes" },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
      {navItems.map(({ icon, label, path }) => {
        const active = pathname === path;
        return (
          <Link key={path} href={path} asChild>
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
              <Ionicons
                name={icon}
                size={22}
                color={active ? COLORS.primary : COLORS.mutedForeground}
              />
              <Text
                style={[
                  styles.label,
                  { color: active ? COLORS.primary : COLORS.mutedForeground },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 64,
    paddingBottom: 8,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Nunito",
  },
});

export default BottomNav;
