import NextAuth from 'next-auth'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '@/lib/prisma';


export const {auth, handlers} = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers:[],
});
