import type { Metadata } from 'next';

import { ConfiguratorProvider } from '@/components/consultation-form/ConfiguratorProvider';
import ScrollPerfProvider from '@/components/ScrollPerfProvider';
import { bebasNeue, montserrat } from '@/lib/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: 'Hair Clinic PRIVÉ',
  description: 'Premium hair clinic — Hair Clinic PRIVÉ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${montserrat.variable} ${bebasNeue.variable}`}>
      <body>
        <ConfiguratorProvider>
          <ScrollPerfProvider>{children}</ScrollPerfProvider>
        </ConfiguratorProvider>
      </body>
    </html>
  );
}