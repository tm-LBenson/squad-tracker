import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from './components/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Leaders Tracker',
  description:
    "Leader Tracker is a powerful app designed for leaders to efficiently manage their teams. Keep track of your subordinates and peers, set up automatic notifications for important deadlines, and ensure you're always on top of time-sensitive data. With an intuitive interface and seamless functionality, Leader Tracker makes personnel management easy and effective.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>{children}</body>
      </UserProvider>
    </html>
  );
}
