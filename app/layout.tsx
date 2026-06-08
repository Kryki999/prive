import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ConfiguratorProvider } from '@/components/consultation-form/ConfiguratorProvider';
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
        <ConfiguratorProvider>{children}</ConfiguratorProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}