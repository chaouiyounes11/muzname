'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import CssBaseline from '@mui/material/CssBaseline';
import { FavoriteNamesContextProvider } from "./store/favorite-names-context";
import {SessionProvider} from 'next-auth/react';


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning={true}  lang="en">
      <body suppressHydrationWarning={true}  className={inter.className}>
      <SessionProvider>
      <FavoriteNamesContextProvider>
      <AppRouterCacheProvider options={{ key: 'css' }}>
          <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
          </ThemeProvider>
      </AppRouterCacheProvider>
      </FavoriteNamesContextProvider>
      </SessionProvider>
      </body>
    </html>
  );
}
