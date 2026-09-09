import { DEMO_USERS } from "./demoData";
import { UserItem } from "../types";

let inMemoryUsers = [...DEMO_USERS];

export class DemoUserRepository {
  static async findById(id: string): Promise<UserItem | null> {
    const user = inMemoryUsers.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  static async findByEmail(email: string): Promise<UserItem | null> {
    const user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  }

  static async getAll(): Promise<UserItem[]> {
    return [...inMemoryUsers];
  }

  static async create(data: Partial<UserItem>): Promise<UserItem> {
    const newUser: UserItem = {
      id: `usr_${Date.now()}`,
      email: data.email || `user_${Date.now()}@example.com`,
      name: data.name || "Demo Customer",
      role: data.role || "CUSTOMER",
      avatar: data.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
      phone: data.phone || null,
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
    };
    inMemoryUsers.push(newUser);
    return newUser;
  }

  static async update(id: string, data: Partial<UserItem>): Promise<UserItem | null> {
    const idx = inMemoryUsers.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    inMemoryUsers[idx] = { ...inMemoryUsers[idx], ...data };
    return inMemoryUsers[idx];
  }
}
