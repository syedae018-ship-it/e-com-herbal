import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ContentProvider } from '@/context/ContentContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Toast } from '@/components/ui/Toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'MUSTAFA LIFE | Naturally Better. Everyday.',
  description:
    'Discover thoughtfully crafted organic and herbal products made for healthier everyday living. 100% natural ingredients, clean formulations, and time-tested Ayurvedic remedies.',
  keywords: [
    'Mustafa Life',
    'Organic Wellness',
    'Ayurvedic Herbs',
    'Natural Skincare',
    'Organic Moringa',
    'Herbal Hair Oil',
    'Clean Nutrition',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-cream-100 text-charcoal-900 font-sans selection:bg-sage-200 selection:text-forest-950">
        <AuthProvider>
          <ContentProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <Toast />
            </CartProvider>
          </ContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
