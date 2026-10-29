import CreditRiskApp from "@/components/CreditRiskApp";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <CreditRiskApp />
      </div>
    </main>
  );
}
