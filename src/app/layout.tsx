import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Landform Racers — Race Through the Landforms. Learn About Life.',
  description: 'An interactive two-team Class 6 Geography racing game exploring Earth’s major landforms and human life adaptation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
