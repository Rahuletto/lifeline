import { Account, Client, ID } from "node-appwrite";
import { Account as ClientAccount, Client as ClientSide } from "appwrite";
import { client } from "./appwrite";

export class AuthService {
  client = client;
  account;
  sessionClient;
  sessionAccount;

  constructor() {
    this.sessionClient = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_ID ?? "");
    this.sessionAccount = new Account(this.sessionClient);
    this.account = new Account(client);
  }

  async createAccount({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.sessionAccount.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
    }

    return null;
  }

  async getCurrentSession() {
    try {
      return await this.sessionAccount.getSession("current");
    } catch (error) {
      console.log("Appwrite service :: getCurrentSession :: error", error);
    }

    return null;
  }

  async getSession(sessionId: string) {
    try {
      console.log(sessionId);
      return await this.sessionAccount.getSession(sessionId);
    } catch (error) {
      console.log("Appwrite service :: getSession :: error", error);
    }

    return null;
  }

  async logout() {
    try {
      const session = await this.getCurrentSession();
      await this.sessionAccount.deleteSession(session?.$id ?? "");
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}

export class ClientAuth {
  sessionClient;
  sessionAccount;

  constructor() {
    this.sessionClient = new ClientSide()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_ID ?? "");
    this.sessionAccount = new ClientAccount(this.sessionClient);
  }

  async createAccount({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    try {
      const userAccount = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      const user = await userAccount.json();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const session = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const user = await session.json();
      if(user.secret) {
        document.cookie = `session=${user.secret}; path=/`;
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  getCurrentUser() {
    try {
      const sessionCookie = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("session="));
      this.sessionClient.setSession(sessionCookie?.split("=")[1] ?? "");
      return this.sessionAccount.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
    }

    return null;
  }

   getCurrentSession() {
    try {
      const sessionCookie = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("session="));
      this.sessionClient.setSession(sessionCookie?.split("=")[1] ?? "");
      return this.sessionAccount.getSession("current");
    } catch (error) {
      console.log("Appwrite service :: getCurrentSession :: error", error);
    }

    return null;
  }

  getSession(sessionId: string) {
    try {
      const sessionCookie = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("session="));
      this.sessionClient.setSession(sessionCookie?.split("=")[1] ?? "");
      return this.sessionAccount.getSession(sessionId);
    } catch (error) {
      console.log("Appwrite service :: getSession :: error", error);
    }

    return null;
  }

  logout() {
    try {
      const sessionCookie = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("session="));
      this.sessionClient.setSession(sessionCookie?.split("=")[1] ?? "");
      return this.sessionAccount.deleteSession("current");
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}
