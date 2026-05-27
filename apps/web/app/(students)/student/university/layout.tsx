import { Header } from "@/components/landing/Header";

export default function UniversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

