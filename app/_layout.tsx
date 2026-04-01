import { Tabs } from "expo-router";
import { ProductProvider } from "@/contexts/ProductContext";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { usePathname } from "expo-router";
import { Link } from "expo-router";

const COLORS = {
  card: "#EDE6DF",
  primary: "#B8734A",
  mutedForeground: "#8A7A6E",
  border: "#D5C9BC",
  background: "#F5F0EB",
};

const navItems = [
  { name: "index", icon: "home-outline" as const, label: "Início", path: "/" },
  { name: "clientes/index", icon: "people-outline" as const, label: "Cadastro", path: "/clientes" },
];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const item = navItems.find((n) => n.name === route.name);
        if (!item) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={isFocused ? COLORS.primary : COLORS.mutedForeground}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? COLORS.primary : COLORS.mutedForeground },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function RootLayout() {
  return (
    <ProductProvider>
      <StatusBar style="dark" />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Início",
          }}
        />
        <Tabs.Screen
          name="clientes/index"
          options={{
            title: "Cadastro",
          }}
        />
        <Tabs.Screen
          name="produto/[id]"
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="produto/[id]/editar"
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="admin/index"
          options={{
            tabBarButton: () => null,
          }}
        />
      </Tabs>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 64,
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Nunito",
  },
});
