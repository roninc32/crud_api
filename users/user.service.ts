import bcrypt from "bcryptjs";
import db from "../_helpers/db";
import { User } from "./user.model"; // Import User

export const userService = {
    getAll,
    getByID,
    create,
    update,
    delete: _delete
};

async function getAll(): Promise<User[]> {
    if (!db.User) throw new Error("Database not initialized");
    return await db.User.findAll();
}

async function getByID(id: number): Promise<User> {
    return await getUser(id);
}

interface CreateUserParams {
    email: string;
    password: string;
    title: string;
    firstName: string;
    lastName: string;
    role: string;
}

async function create(params: CreateUserParams): Promise<void> {
    if (!db.User) throw new Error("Database not initialized");

    if (await db.User.findOne({ where: { email: params.email } })) {
        throw new Error(`Email "${params.email}" is already taken`);
    }

    await db.User.create({
        ...params,
        passwordHash: hash(params.password),
    });
}

async function update(id: number, params: Partial<CreateUserParams>): Promise<void> {
    if (!db.User) throw new Error("Database not initialized");

    const user = await getUser(id);

    if (params.email && params.email !== user.email) {
        if (await db.User.findOne({ where: { email: params.email } })) {
            throw new Error(`Email "${params.email}" is already taken`);
        }
    }

    // Creiamo un nuovo oggetto aggiornato per evitare problemi di tipo
    const updatedParams: Partial<CreateUserParams & { passwordHash?: string }> = { ...params };

    if (params.password) {
        updatedParams.passwordHash = hash(params.password);
        delete updatedParams.password;
    }

    Object.assign(user, updatedParams);
    await user.save();
}


async function _delete(id: number): Promise<void> {
    if (!db.User) throw new Error("Database not initialized");

    const user = await getUser(id);
    await user.destroy();
}

async function getUser(id: number): Promise<User> {
    if (!db.User) throw new Error("Database not initialized");

    const user = await db.User.findByPk(id);
    if (!user) throw new Error("User not found");
    return user;
}

// Hash password
function hash(password: string): string {
    return bcrypt.hashSync(password, 10);
}