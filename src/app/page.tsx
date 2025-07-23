import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WalletConnectButton from "@/components/WalletConnectButton";

export default function Home() {
  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-gradient-to-br from-[#19181C] via-[#1a2024] to-[#19181C]">
        <main className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center text-[#E6F0F0]">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#15C0B9] to-[#E6F0F0] bg-clip-text text-transparent">
                Division One Crypto
              </h1>
              <p className="text-lg md:text-xl text-[#E6F0F0]/80 mb-8">
                Connect your wallet to get started with college crypto contributions
              </p>
            </div>

            {/* Mobile-only Wallet Connect Button */}
            <div className="md:hidden mb-8">
              <div className="flex justify-center">
                <WalletConnectButton />
              </div>
            </div>

            {/* Additional content can go here */}
          </div>
        </main>
      </div>
    </DefaultLayout>
  );
}
