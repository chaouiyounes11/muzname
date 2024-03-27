import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';

export const handler = NextAuth({
    secret: process.env.NEXTATH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
    ],
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            if (!profile?.email) {
                throw new Error('No profile');
            }
            await prisma.user.upsert({
                where: {email: profile.email},
                update: {email: profile.email},
                create: {email: profile.email, name: profile.name, favoriteNames: []}
            });
            return true;
        },
    }
});


export { handler as GET, handler as POST }


