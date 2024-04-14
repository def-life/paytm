import express, { Request, Response } from "express"
import prisma from "@repo/db/client"
const app = express()




app.use(express.json())


app.post("hdfcWebhook", async (req: Request, res: Response) => {
    // zod validation
    // validate the request via some secret
    const paymentInformation: {
        token: string
        userId: string
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
        await prisma.$transaction([
            prisma.balance.update({
                where: {
                    userId: paymentInformation.userId,

                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            })
            ,
            prisma.onRampTransaction.update({
                where: {
                    token: paymentInformation.token,
                },
                data: {
                    status: "Success"
                }
            })

        ])

        res.json({
            message: "Captured"
        })

    } catch (err) {
        console.error(err);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }





})


app.listen(3003);