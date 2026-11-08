import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    // Create Account
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create({
                userId: ID.unique(),
                email,
                password,
                name
            });

            if (userAccount) {
                return await this.login({ email, password });
            }

            return userAccount;

        } catch (error) {
            console.log("Appwrite service :: createAccount :: error", error);
            throw error;
        }
    }

    // Login
    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession({
                email,
                password
            });
        } catch (error) {
            console.log("Appwrite service :: login :: error", error);
            throw error;
        }
    }

    // Get Current User
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    // Logout
    async logout() {
        try {
            await this.account.deleteSessions();
            return true;
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
            return false;
        }
    }
}

const authService = new AuthService();

export default authService;
