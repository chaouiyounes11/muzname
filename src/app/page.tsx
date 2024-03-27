'use client';

import GetIdeasNames from '@/app/components/GetIdeasNames/get-ideas-names';
import { useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default function Home() {
    const { data: session, status } = useSession();

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-3">
            <GetIdeasNames />
        </main>
    );
}
