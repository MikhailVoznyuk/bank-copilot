import { NextResponse } from "next/server";
import { getSession } from "@/shared/auth/session";

export async function GET() {
    const sessionUser = await getSession();

    if (!sessionUser) {
        return NextResponse.json(
            {message: "Пользователь не авторизован."},
            {status: 401}
        )
    }

    return NextResponse.json(
        {user: sessionUser}
    )
}