"use server"

import prisma from "@repo/db/client"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";


export async function p2pTransfer(to: string, amount: number) {
    // zod validation
    const session = await getServerSession(authOptions)
    if (!session.user || !session.user.id) {
        return {
            message: "Unauthenticated request"
        }
    }


    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    })

    if (!toUser) {
        return {
            message: "User not found"
        }
    }


    try {

        await prisma.$transaction(async (tx) => {

            await tx.$executeRawUnsafe('select * from "Balance" where "userId"=$1 for update', session.user.id)
            const fromUser = await tx.balance.findFirst({
                where: {
                    userId: session.user.id
                }
            })

            if (!fromUser || fromUser.amount < amount) {
                throw new Error('Insufficient funds');
            }


            await tx.balance.update({
                where: {
                    userId: toUser.id
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }

            }),

                await tx.balance.update({
                    where: {
                        userId: session.user.id
                    },
                    data: {
                        amount: {
                            decrement: amount
                        }
                    }

                })
            await tx.p2pTransfer.create({
                data: {
                    fromUserId: session.user.id,
                    toUserId: toUser.id,
                    amount
                }
            })

        })
        // add this transfer entry to the database
        return {
            message: "done"
        }
    } catch (err) {
        console.log(err)
        return {
            message: "transaction failed"
        }
    }




}