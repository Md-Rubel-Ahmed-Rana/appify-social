import AppNavbar from "@/components/layout/app-navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AppNavbar />
      <main>{children}</main>
    </div>
  );
}
