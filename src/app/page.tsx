import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WalletConnectButton from "@/components/WalletConnectButton";
import CommunityCarousel from "@/components/CommunityCarousel";
import CollegeLeaderboard from "@/components/CollegeLeaderboard";
import FAQ from "@/components/FAQ";
import Image from "next/image";
import AnimatedElement from "@/components/AnimatedElement";

export default function Home() {
  // Sample data for the community carousel
  const communityItems = [
    {
      id: "1",
      image: "/colleges/college_placeholder.png",
      title: "LSU Tigers",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: "2",
      image: "/colleges/college_placeholder.png",
      title: "Alabama Crimson Tide",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: "3",
      image: "/colleges/college_placeholder.png",
      title: "Duke Blue Devils",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: "4",
      image: "/colleges/college_placeholder.png",
      title: "UCLA Bruins",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: "5",
      image: "/colleges/college_placeholder.png",
      title: "Texas Longhorns",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-[#03211e]">
        <main className="container mx-auto px-6 py-16">
          {/* Header Section */}
          <AnimatedElement>
            {/* Full-width background container */}
            <div 
              className="absolute inset-0 w-screen left-1/2 transform -translate-x-1/2 -z-10"
              style={{
                backgroundImage: 'url(/bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh'
              }}
            />
            
            {/* Content container */}
            <div className="max-w-4xl mx-auto text-center text-[#E6F0F0] relative z-10">
              {/* Subtitle */}
              <div className="mb-4">
                <p className="text-sm md:text-base text-[#E6F0F0]/80 font-medium">
                  Send 2 $D1C to your team for every 100 $D1C trade
                </p>
              </div>

              {/* Main Title */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold md:max-w-2xl text-center mx-auto mb-6 text-white">
                  Support your favorite school,{" "}
                  <span className="italic">every </span>trade counts
                </h1>
              </div>

              {/* Search Input */}
              <div className="mb-12 max-w-100 mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 z-999 flex items-center pointer-events-none">
                    <svg
                      className="h-6 w-6 text-[#E6F0F0]/90"
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
                    className="w-full pl-14 pr-4 py-4 bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-md text-[#E6F0F0] placeholder-[#E6F0F0]/90 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:border-transparent transition-all duration-300 text-lg"
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
          </AnimatedElement>

          {/* Recently Supported by Community Section */}
          <div className="mt-24 mb-16">
            <AnimatedElement>
              <div className="max-w-6xl mx-auto">
                <CommunityCarousel items={communityItems} />
              </div>
            </AnimatedElement>
          </div>

          {/* How Does It Work Section */}
          <div className="mt-32 mb-24">
            <AnimatedElement>
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-4">
                  <h4 className="text-sm text-[#E6F0F0]/80">GET IN THE GAME</h4>
                </div>
                {/* Centered Title */}
                <div className="text-center mb-16">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-4">
                    Your $D1C game plan
                  </h3>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                  {/* Step 1: Connect Your Wallet */}
                  <div className="flex flex-col items-center text-left">
                    <div className="relative w-full h-56 mb-6">
                      <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300">
                        <Image
                          src="/landing/connect2.png"
                          alt="Connect your wallet"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-left w-full text-xl md:text-lg lg:text-xl font-semibold text-white mb-2">
                      Connect your wallet
                    </h3>
                    <p className="text-left w-full text-sm text-white/80 mb-2">
                      Link your Phantom wallet to unlock direct access to NIL
                      impact.
                    </p>
                  </div>

                  {/* Step 2: Pick a School */}
                  <div className="flex flex-col items-center text-left">
                    <div className="relative w-full h-56 mb-6">
                      <div className="w-full h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300">
                        <Image
                          src="/landing/pickschool2.png"
                          alt="Pick a school"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-left w-full text-xl md:text-lg lg:text-xl font-semibold text-white mb-2">
                      Pick a school
                    </h3>
                    <p className="text-left w-full text-sm text-white/80 mb-2">
                      Select your program as your team of choice and fuel their
                      athletes with every trade.
                    </p>
                  </div>

                  {/* Step 3: Start Trading */}
                  <div className="flex flex-col items-center text-left">
                    <div className="relative w-full h-56 mb-6">
                      <div className="w-full h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300">
                        <Image
                          src="/landing/starttrading2.png"
                          alt="Start trading"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-left w-full text-xl md:text-lg lg:text-xl font-semibold text-white mb-2">
                      Start trading
                    </h3>
                    <p className="text-left w-full text-sm text-white/80 mb-2">
                      Trade $D1C and turn your fan energy into real support with
                      every transaction.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>

          {/* Built for Fans Section */}
          <div className="mt-32 mb-24">
            <AnimatedElement>
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-4">
                  <h4 className="text-sm text-[#E6F0F0]/80 ">
                    SCHOOL PRIDE FUELS PLAYERS
                  </h4>
                </div>
                {/* Title */}
                <div className="text-center mb-16">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-4">
                    Designed for fans, built for impact
                  </h3>
                </div>

                {/* Content Layout */}
                <div className="space-y-12">
                  {/* Image Section - Always on top for lg screens */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:hidden">
                    {/* Image for sm/md - side by side */}
                    <div className="order-1">
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md relative w-full h-80 md:h-96">
                        <Image
                          src="/landing/builtforimpact2.png"
                          alt="Built for impact"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </div>

                    {/* Text Content for sm/md */}
                    <div className="order-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Your trades help fund athletes */}
                        <div className="text-center md:text-left">
                          <h4 className="text-xl font-semibold text-[#E6F0F0] mb-3">
                            Your trades help fund athletes
                          </h4>
                          <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                            2% of every $D1C transaction goes to your selected
                            school&apos;s NIL wallet
                          </p>
                        </div>

                        {/* See where your support goes */}
                        <div className="text-center md:text-left">
                          <h4 className="text-xl font-semibold text-[#E6F0F0] mb-3">
                            See where your support goes
                          </h4>
                          <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                            All contributions are recorded on-chain and visible
                            in real time
                          </p>
                        </div>

                        {/* No barriers to join */}
                        <div className="text-center md:text-left">
                          <h4 className="text-xl font-semibold text-[#E6F0F0] mb-3">
                            No barriers to join
                          </h4>
                          <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                            Anyone can participate. No minimums or complex
                            requirements
                          </p>
                        </div>

                        {/* Support any Division 1 program */}
                        <div className="text-center md:text-left">
                          <h4 className="text-xl font-semibold text-[#E6F0F0] mb-3">
                            Support any Division 1 program
                          </h4>
                          <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                            Back the teams you care about, from powerhouses to
                            underdogs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Large screen layout - Image on top, text below */}
                  <div className="hidden lg:block space-y-12">
                    {/* Image Section for lg */}
                    <div className="w-full">
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md relative w-full h-96">
                        <Image
                          src="/landing/builtforimpact2.png"
                          alt="Built for impact"
                          fill
                          className="object-cover rounded-md w-full"
                        />
                      </div>
                    </div>

                    {/* Text Content for lg - 4 columns side by side */}
                    <div className="grid grid-cols-4 gap-8">
                      {/* Your trades help fund athletes */}
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-[#E6F0F0] mb-3">
                          Your trades help fund athletes
                        </h4>
                        <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                          2% of every $D1C transaction goes to your selected
                          school&apos;s NIL wallet
                        </p>
                      </div>

                      {/* See where your support goes */}
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-[#E6F0F0] mb-3">
                          See where your support goes
                        </h4>
                        <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                          All contributions are recorded on-chain and visible in
                          real time
                        </p>
                      </div>

                      {/* No barriers to join */}
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-[#E6F0F0] mb-3">
                          No barriers to join
                        </h4>
                        <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                          Anyone can participate. No minimums or complex
                          requirements
                        </p>
                      </div>

                      {/* Support any Division 1 program */}
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-[#E6F0F0] mb-3">
                          Support any Division 1 program
                        </h4>
                        <p className="text-[#E6F0F0]/70 text-base leading-relaxed">
                          Back the teams you care about, from powerhouses to
                          underdogs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>

          {/* Top Contributions Section */}
          <div className="mt-32 mb-24">
            <AnimatedElement>
              <div className="text-center mb-4">
                <h4 className="text-sm text-[#E6F0F0]/80 ">RULING THE FIELD</h4>
              </div>
              <CollegeLeaderboard />
            </AnimatedElement>
          </div>

          {/* FAQ Section */}
          <div className="mt-32 mb-24">
            <AnimatedElement>
              <FAQ />
            </AnimatedElement>
          </div>

          {/* Additional content can go here */}
        </main>
      </div>
    </DefaultLayout>
  );
}
