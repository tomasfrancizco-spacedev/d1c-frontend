import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WalletConnectButton from "@/components/WalletConnectButton";
import CommunityCarousel from "@/components/CommunityCarousel";
import TopContributions from "@/components/TopContributions";
import FAQ from "@/components/FAQ";
import Image from "next/image";

export default function Home() {
  // Sample data for the community carousel
  const communityItems = [
    {
      id: "1",
      image: "/divisionlogo2.png",
      title: "LSU Tigers",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      id: "2", 
      image: "/divisionlogo2.png",
      title: "Alabama Crimson Tide",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      id: "3",
      image: "/divisionlogo2.png", 
      title: "Duke Blue Devils",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      id: "4",
      image: "/divisionlogo2.png",
      title: "UCLA Bruins",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      id: "5",
      image: "/divisionlogo2.png",
      title: "Texas Longhorns",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    }
  ];

  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-[#03211e]">
        <main className="container mx-auto px-6 py-16">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center text-[#E6F0F0]">
            {/* Subtitle */}
            <div className="mb-4">
              <p className="text-sm md:text-base text-[#E6F0F0]/80 font-medium">
                Send 2 $D1C to your team for every 100 $D1C trade
              </p>
            </div>

            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-bold md:max-w-2xl text-center mx-auto mb-6 bg-[#E6F0F0] bg-clip-text text-transparent">
                Support your favorite school, <span className="italic">every </span>trade counts
              </h1>
            </div>

            {/* Search Input */}
            <div className="mb-12 max-w-100 mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 z-999 flex items-center pointer-events-none">
                  <svg 
                    className="h-6 w-6 text-[#E6F0F0]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Look up your favorite school..."
                  className="w-full pl-14 pr-4 py-4 bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-md text-[#E6F0F0] placeholder-[#E6F0F0]/60 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>
            </div>

            {/* Mobile-only Wallet Connect Button */}
            <div className="md:hidden mb-8">
              <div className="flex justify-center">
                <WalletConnectButton />
              </div>
            </div>
          </div>

          {/* Recently Supported by Community Section */}
          <div className="mt-24 mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-left mb-8">
                <h4 className="text-sm text-[gray]">
                  Recently supported by the community
                </h4>
              </div>
              
              <CommunityCarousel 
                items={communityItems}
              />
            </div>
          </div>

          {/* How Does It Work Section */}
          <div className="mt-32 mb-24">
            <div className="max-w-6xl mx-auto px-6">
              {/* Centered Title */}
              <div className="text-center mb-16">
                <h3 className="text-2xl md:text-3xl lg:text-4xl text-[#E6F0F0] mb-4">
                  How does it work?
                </h3>
              </div>

              {/* Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                
                {/* Step 1: Connect Your Wallet */}
                <div className="flex flex-col items-center text-left">
                  <div className="relative w-full h-56 mb-6">
                    <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300">
                      <Image
                        src="/landing/connect.png"
                        alt="Connect your wallet"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-lg lg:text-xl font-semibold text-[#E6F0F0] mb-2">
                    Connect your wallet
                  </h3>
                </div>

                {/* Step 2: Pick a School */}
                <div className="flex flex-col items-center text-left">
                <div className="relative w-full h-56 mb-6">
                    <div className="w-full h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300">
                      <Image
                        src="/landing/pickschool.png"
                        alt="Pick a school"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-lg lg:text-xl font-semibold text-[#E6F0F0] mb-2">
                    Pick a school
                  </h3>
                </div>

                {/* Step 3: Start Trading */}
                <div className="flex flex-col items-center text-left">
                <div className="relative w-full h-56 mb-6">
                    <div className="w-full h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300">
                      <Image
                        src="/landing/starttrading.png"
                        alt="Start trading"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-lg lg:text-xl font-semibold text-[#E6F0F0] mb-2">
                    Start trading
                  </h3>
                </div>

              </div>
            </div>
          </div>

          {/* Built for Fans Section */}
          <div className="mt-32 mb-24">
            <div className="max-w-6xl mx-auto px-6">
              {/* Title */}
              <div className="text-center mb-16">
                <h3 className="text-2xl md:text-3xl lg:text-4xl text-[#E6F0F0] mb-4">
                  Built for fans
                </h3>
              </div>

              {/* Content Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Image Section */}
                <div className="order-2 md:order-1">
                  <div className="relative w-full h-80 md:h-96">
                    <div className="w-full h-full bg-[#15C0B9]/20 backdrop-blur-md border border-[#15C0B9]/30 rounded-md overflow-hidden">
                      {/* Placeholder for image - you can replace with actual image */}
                      <div className="w-full h-full bg-gradient-to-br from-[#15C0B9]/30 to-[#15C0B9]/10 flex items-center justify-center">
                        <div className="text-[#15C0B9] text-lg font-medium">Image Placeholder</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content Section */}
                <div className="order-2 space-y-8">
                  
                  {/* Built for fans */}
                  <div>
                    <h4 className="text-xl font-semibold text-[#E6F0F0] mb-3">
                      Built for fans
                    </h4>
                    <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                      Your trades help fund real athletes at your school.
                    </p>
                  </div>

                  {/* NIL-Ready */}
                  <div>
                    <h4 className="text-xl font-semibold text-[#E6F0F0] mb-3">
                      NIL-Ready
                    </h4>
                    <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                      D1C aligns with Name, Image & Likeness rules.
                    </p>
                  </div>

                  {/* Simple participation */}
                  <div>
                    <h4 className="text-xl font-semibold text-[#E6F0F0] mb-3">
                      Simple participation
                    </h4>
                    <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                      Just connect, choose, and trade.
                    </p>
                  </div>

                  {/* Every Trade Sends $1 */}
                  <div>
                    <h4 className="text-xl font-semibold text-[#E6F0F0] mb-3">
                      Every Trade Sends $1
                    </h4>
                    <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                      Real impact, every time.
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Top Contributions Section */}
          <div className="mt-32 mb-24">
            <TopContributions />
          </div>

          {/* FAQ Section */}
          <div className="mt-32 mb-24">
            <FAQ />
          </div>

          {/* Additional content can go here */}
        </main>
      </div>
    </DefaultLayout>
  );
}
