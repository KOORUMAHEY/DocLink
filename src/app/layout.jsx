
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { I18nProvider } from '@/context/i18n';
import { AuthProvider } from '@/context/auth';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

export const metadata = {
  title: 'DocLink - Your Health, Connected',
  description: 'Seamlessly book and manage your doctor appointments.',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;700&family=Noto+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
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
