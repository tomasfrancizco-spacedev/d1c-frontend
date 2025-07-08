import WalletConnectButton from "@/components/WalletConnectButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19181C] via-[#1a2024] to-[#19181C]">
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <WalletConnectButton />
        </div>
      </main>
    </div>
  );
}
