export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-mid) 100%)",
      }}
    >
      {children}
    </div>
  );
}
