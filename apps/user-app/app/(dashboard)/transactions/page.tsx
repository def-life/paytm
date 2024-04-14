import prisma from "@repo/db/client"
import { cookies } from "next/headers"

async function Page() {
    cookies()
    const transactions = await prisma.p2pTransfer.findMany()
    return (
        <div>{JSON.stringify(transactions)}</div>
    )
}

export default Page