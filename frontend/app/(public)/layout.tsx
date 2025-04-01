import Title from "@/components/title";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header>
        <div className="flex justify-center mt-5 items-center">
          <Title />
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
