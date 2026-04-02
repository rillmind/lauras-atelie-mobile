const API_BASE_URL = "https://lauras-atelie-api.onrender.com";

export interface Product {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  categoria: string;
  imagemUrl: string | null;
  materiais: string[];
  dimensoes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/produtos`);
  if (!res.ok) throw new Error("Erro ao carregar produtos");
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/produtos/${id}`);
  if (!res.ok) throw new Error("Produto não encontrado");
  return res.json();
}

export async function createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Erro ao criar produto");
  return res.json();
}

export async function updateProduct(id: number, product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/produtos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Erro ao atualizar produto");
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/produtos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar produto");
}

export async function fetchClients(): Promise<Client[]> {
  const res = await fetch(`${API_BASE_URL}/usuarios`);
  if (!res.ok) throw new Error("Erro ao carregar clientes");
  const all: Client[] = await res.json();
  return all.filter((u) => !u.isAdmin);
}

export async function createClient(client: Omit<Client, "id" | "isAdmin" | "createdAt" | "updatedAt">): Promise<Client> {
  const res = await fetch(`${API_BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...client, isAdmin: false }),
  });
  if (!res.ok) throw new Error("Erro ao criar cliente");
  return res.json();
}

export async function verifyAdminPassword(email: string, senha: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/usuarios/verify-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!res.ok) return false;
  return res.json();
}

export async function findAdmin(): Promise<{ id: number; nome: string } | null> {
  const res = await fetch(`${API_BASE_URL}/usuarios/admin`);
  if (!res.ok) return null;
  return res.json();
}
