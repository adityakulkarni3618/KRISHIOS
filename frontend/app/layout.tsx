export const metadata = { title: "AGRINEXUS" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="mr"><body style={{ fontFamily: "system-ui", fontSize: 18 }}>{children}</body></html>);
}
