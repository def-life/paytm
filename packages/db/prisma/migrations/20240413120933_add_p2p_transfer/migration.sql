-- CreateTable
CREATE TABLE "p2pTransfer" (
    "id" TEXT NOT NULL,
    "tiimeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,

    CONSTRAINT "p2pTransfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "p2pTransfer" ADD CONSTRAINT "p2pTransfer_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2pTransfer" ADD CONSTRAINT "p2pTransfer_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
