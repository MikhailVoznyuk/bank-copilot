import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/shared/db/prisma";
import { verifyPassword} from "@/shared/lib/password";
import { createSession } from "@/shared/auth/session";
import type { User as DbUser } from "@/generated/prisma/client";
import type { User as SafeUser } from "@/entities/user/model/types";

const loginSchema = z.object({
    login: z.string().min(1),
    password: z.string().min(1),
})

function toSafeUser(user: DbUser): SafeUser {
    return {
        id: user.id,
        login: user.login,
        role: user.role,
        actorId: user.actorId,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        status: user.status,
    }
}

export async function POST(request: Request) {
    let body: unknown;

    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({
            message: "Некорректный JSON",
            status: 400
        })
    }
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({
            message: "Некорректные данные для ввода",
            status: 422,
        })
    }

    const {login, password} = parsed.data;

    const user = await prisma.user.findUnique({
        where: {login},
    })

    if (!user) {
        return NextResponse.json({
            message: "Неверный логин или пароль",
            status: 401
        })
    }

    const isValidPassword = verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
        return NextResponse.json({
            message: "Неверный логин или пароль",
            status: 401
        })
    }

    const safeUser = toSafeUser(user);

    await createSession({
        userId: safeUser.id,
        actorId: safeUser.actorId,
        role: safeUser.role,
        login: safeUser.login,
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
    });

    return NextResponse.json({user: safeUser});
}