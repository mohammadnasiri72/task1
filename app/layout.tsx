import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import Providers from '@/components/Providers';

const vazir = Vazirmatn({ subsets: ['arabic', 'latin'], display: 'swap' });

export const metadata: Metadata = { title: 'درخت حساب ها' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazir.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
