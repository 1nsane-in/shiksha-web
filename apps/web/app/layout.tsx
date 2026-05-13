import { Providers } from './providers';
import './globals.css';
import { initAnalytics } from '@/lib/analytics';

initAnalytics();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
