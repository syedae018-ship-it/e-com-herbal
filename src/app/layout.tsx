import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Toast } from '@/components/ui/Toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'HERBAL E COM LIFE | Naturally Better. Everyday.',
  description:
    'Discover thoughtfully crafted organic and herbal products made for healthier everyday living. 100% natural ingredients, clean formulations, and time-tested Ayurvedic remedies.',
  keywords: [
    'Herbal E Com Life',
    'Organic Personal Care',
    'Ayurvedic Herbs',
    'Natural Skincare',
    'Herbal Soaps',
    'Herbal Hair Oil',
    'Handmade Bath Bars',
    'Plant-Based Beauty',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-cream-100 text-charcoal-900 font-sans selection:bg-sage-200 selection:text-forest-950">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <Toast />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
