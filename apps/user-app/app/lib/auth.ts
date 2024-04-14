import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req) {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        number: credentials?.phone
                    }
                })

                if (existingUser) {
                    const result = await bcrypt.compare(credentials.password, existingUser.password)
                    if (result) {
                        return {
                            id: existingUser.id,
                            name: existingUser.name,
                            email: existingUser.email
                        }
                    }

                    return null
                }


                try {
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    const user = await prisma.user.create({
                        data: {
                            password: hashedPassword,
                            number: credentials.phone,
                        }
                    });

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.number
                    }
                } catch (e) {
                    console.error(e);
                }
                return null

            }
        })
    ],
    secret: process.env.NEXTAUTH_URL,
    callbacks: {
        async jwt({ token, account, profile }: any) {

            // console.log("jwt callback", { token, account, profile })
            return token
        },
        async session({ session, token, user }: any) {
            session.user.id = token.sub
            return session
        }
    }
}

