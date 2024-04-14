import prisma from "@repo/db/client"

async function Page() {
    const transactions = await prisma.p2pTransfer.findMany()
    return (
        <div>{JSON.stringify(transactions)}</div>
    )
}

export default Page
export const dynamic = 'force-dynamic'