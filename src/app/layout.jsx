
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { I18nProvider } from '@/context/i18n';
import { AuthProvider } from '@/context/auth';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'DocLink - Your Health, Connected',
  description: 'Seamlessly book and manage your doctor appointments.',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <AuthProvider>
          <I18nProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
