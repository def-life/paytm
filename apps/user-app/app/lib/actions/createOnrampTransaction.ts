"use server"

import prisma from "@repo/db/client"
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { revalidatePath } from "next/cache";

export async function createOnRampTransaction(provider: string, amount: number) {
    // zod validation
    const session = await getServerSession(authOptions)
    if (!session.user || !session.user.id) {
        return {
            message: "Unauthenticated request"
        }
    }

    const token = (Math.random() * 1000).toString();
    await prisma.onRampTransaction.create({
        data: {
            amount: amount * 100,
            provider,
            status: "Processing",
            token,
            userId: session.user.id,
            startTime: new Date(),
        }
    })

    revalidatePath("/transfer")

    return {
        message: "done"
    }

}