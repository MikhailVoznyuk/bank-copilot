import { cookies} from "next/headers";
import crypto from "crypto";

export type SessionPayload = {
    userId: string;
    actorId: string;
    role: "client" | "operator";
    login: string;
    firstName: string;
    lastName: string;
}

// Константы для куки
const SESSION_COOKIE_NAME = "bank_copilot_session";

const SESSION_COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: '/',
    maxAge: 60 * 60 * 24
} as const;

function getSecret() {
    const secret = process.env.SESSION_SECRET

    if (!secret) {
        throw new Error('Session secret is not set.')
    }

    return secret;
}

function sign(value: string) {
    const secret = getSecret();
    return crypto.createHmac("sha256", secret)
        .update(value)
        .digest("base64url");
}

function encodeSession(session: SessionPayload) {
    const body = Buffer.from(JSON.stringify(session)).toString("base64url");
    const signature = sign(body);

    return `${body}.${signature}`;
}

function decodeSession(session: string): SessionPayload | null {
    const [body, signature] = session.split(".");

    if (!body || !signature) return null;

    const expected = sign(body);

    if (signature !== expected) return null;

    try {
        return JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    }
    catch (error) {
        return null;
    }

}

export async function createSession(session: SessionPayload): Promise<void> {
    const cookieStore = await cookies();
    const encodedSession = encodeSession(session);

    cookieStore.set(SESSION_COOKIE_NAME, encodedSession, SESSION_COOKIE_OPTIONS);
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) return null;

    return decodeSession(sessionCookie.value);
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE_NAME)
}

