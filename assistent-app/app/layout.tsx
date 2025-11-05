import "./globals.css";

export const metadata = {
  title: "Pizza Assistant",
  description: "Restaurant dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
