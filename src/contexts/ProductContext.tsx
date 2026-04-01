import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  fetchProducts,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  createClient as apiCreateClient,
  fetchClients,
  Product as ApiProduct,
  Client as ApiClient,
  verifyAdminPassword,
} from "@/api/client";

export interface Product {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  categoria: "pronta" | "encomenda";
  imagem: string | null;
  materiais: string[];
  dimensoes: string | null;
}

export interface Client {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

interface ProductContextType {
  products: Product[];
  clients: Client[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  editProduct: (id: number, product: Partial<Omit<Product, "id">>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addClient: (client: Omit<Client, "id">) => Promise<void>;
  getProduct: (id: number) => Product | undefined;
  refresh: () => Promise<void>;
  adminUnlocked: boolean;
  setAdminUnlocked: (value: boolean) => void;
  verifyPassword: (email: string, senha: string) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedProducts, fetchedClients] = await Promise.all([
        fetchProducts(),
        fetchClients(),
      ]);
      setProducts(fetchedProducts);
      setClients(fetchedClients);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    const created = await apiCreateProduct(product);
    setProducts((prev) => [created, ...prev]);
  };

  const editProduct = async (id: number, updates: Partial<Omit<Product, "id">>) => {
    const updated = await apiUpdateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const deleteProduct = async (id: number) => {
    await apiDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addClient = async (client: Omit<Client, "id">) => {
    const created = await apiCreateClient(client);
    setClients((prev) => [created, ...prev]);
  };

  const verifyPassword = async (email: string, senha: string): Promise<boolean> => {
    return verifyAdminPassword(email, senha);
  };

  const getProduct = (id: number) => products.find((p) => p.id === id);

  return (
    <ProductContext.Provider
      value={{
        products,
        clients,
        loading,
        error,
        addProduct,
        editProduct,
        deleteProduct,
        addClient,
        getProduct,
      refresh: loadData,
      adminUnlocked,
      setAdminUnlocked,
      verifyPassword,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
};
