import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CoreInventory - Inventory Management System',
  description: 'Modern inventory management for businesses',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
          {children}
        </main>
      </body>
    </html>
  );
}
