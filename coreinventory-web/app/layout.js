import { DM_Sans, Syne } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

const syne = Syne({ 
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
});

export const metadata = {
  title: 'CoreInventory - Inventory Management System',
  description: 'Modern inventory management for businesses',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
