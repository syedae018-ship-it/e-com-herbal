import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
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

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'NUTRI LIFE | Naturally Better. Everyday.',
  description:
    'Discover thoughtfully crafted organic and herbal products made for healthier everyday living. 100% natural ingredients, clean formulations, and time-tested Ayurvedic remedies.',
  keywords: [
    'Nutri Life',
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
    <html lang="en" className={`${inter.variable} ${poppins.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('nutri_life_active_theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else {
                    var cms = localStorage.getItem('nutri_life_cms_content_v1');
                    if (cms) {
                      var parsed = JSON.parse(cms);
                      if (parsed && parsed.settings && parsed.settings.active_theme) {
                        document.documentElement.setAttribute('data-theme', parsed.settings.active_theme);
                      }
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
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

