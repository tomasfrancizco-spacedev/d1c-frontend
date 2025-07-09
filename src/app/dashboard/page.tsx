import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DashboardCards from "@/components/DashboardCards";
import Image from "next/image";

export default function Dashboard() {
  
  const contributionAmount = "345 $D1C";
  const collegeName = "LSU Athletes";
  const usdAmount = "234 USD";
  const d1cAmount = "1234 $D1C";
  const tradingVolume = "12345678 $D1C";

  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-gradient-to-br from-[#19181C] via-[#1a2024] to-[#19181C]">
        <main className="container mx-auto px-6 py-8 text-[#E6F0F0]">
          
          {/* Header Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center justify-center bg-transparent rounded-lg p-6">
              <div className="flex items-center justify-center w-full max-w-4xl space-x-10">
                {/* Logo on the left */}
                <div className="flex items-center gap-3">
                  <Image
                    src="/divisionlogo2.png"
                    alt="College Logo"
                    width={150}
                    height={150}
                    className="rounded-lg"
                  />
                </div>
                
                {/* Contribution text on the right */}
                <div className="text-left">
                  <p className="text-4xl text-[#E6F0F0] flex flex-col">
                    <span className="font-semibold">You&apos;ve contributed </span>
                    
                    
                    <span className="font-bold text-[#15C0B9] my-2 ">{contributionAmount} </span>
                    
                    
                    <span className="font-semibold text-[#E6F0F0]">
                    to {collegeName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <DashboardCards 
            tradingVolume={tradingVolume}
            d1cAmount={d1cAmount}
            contributionAmount={contributionAmount}
            usdAmount={usdAmount}
          />

          {/* Top Contributions Section */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-[#E6F0F0] text-center mb-12 drop-shadow-md">
              Top contributions from the community
            </h2>
            
            {/* Mobile View - Logos + Cards */}
            <div className="md:hidden">
              {/* Horizontal Logos */}
              <div className="flex justify-center items-center gap-8 mb-8">
                <div className="flex items-center justify-center">
                  <Image
                    src="/divisionlogo2.png"
                    alt="1st Place School Logo"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Image
                    src="/divisionlogo2.png"
                    alt="2nd Place School Logo"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Image
                    src="/divisionlogo2.png"
                    alt="3rd Place School Logo"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Full Width Cards in Column */}
              <div className="space-y-4">
                  {/* 1st Place Card */}
                  <div className="w-full">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src="/divisionlogo2.png"
                          alt="School Logo"
                          width={60}
                          height={60}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex items-center gap-3 flex-1 p-3 bg-[#0C3832] rounded-lg">
                      <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                        <div className="text-sm p-1 min-w-[30px] font-bold text-[#15C0B9] drop-shadow-md text-center">1st</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-[#E6F0F0] drop-shadow-sm">
                          LSU Athletes
                        </div>
                        <div className="text-sm font-bold text-[#15C0B9] drop-shadow-md">
                          2,450 $D1C
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* 2nd Place Card */}
                  <div className="w-full">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src="/divisionlogo2.png"
                          alt="School Logo"
                          width={60}
                          height={60}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex items-center gap-3 flex-1 p-3 bg-[#0C3832] rounded-lg">
                      <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                        <div className="text-sm p-1 min-w-[30px] font-bold text-[#15C0B9] drop-shadow-md text-center">2nd</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-[#E6F0F0] drop-shadow-sm">
                          UCLA Bruins
                        </div>
                        <div className="text-sm font-bold text-[#15C0B9] drop-shadow-md">
                          1,850 $D1C
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* 3rd Place Card */}
                  <div className="w-full">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src="/divisionlogo2.png"
                          alt="School Logo"
                          width={60}
                          height={60}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex items-center gap-3 flex-1 p-3 bg-[#0C3832] rounded-lg">
                      <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                        <div className="text-sm p-1 min-w-[30px] font-bold text-[#15C0B9] drop-shadow-md text-center">3rd</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-[#E6F0F0] drop-shadow-sm">
                          Duke Blue Devils
                        </div>
                        <div className="text-sm font-bold text-[#15C0B9] drop-shadow-md">
                          1,275 $D1C
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop View - Full Cards */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              
              {/* 1st Place Card */}
              <div className="p-6 min-h-[250px]">
                <div className="flex flex-col items-center text-center">
                  {/* School Logo */}
                  <div className="mb-4">
                    <Image
                      src="/divisionlogo2.png"
                      alt="School Logo"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  
                  {/* Position and Details */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                      <div className="text-sm p-2 min-w-[40px] font-bold text-[#15C0B9] drop-shadow-md">1st</div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-lg font-semibold text-[#E6F0F0] drop-shadow-sm">
                        LSU Athletes
                      </div>
                      <div className="text-sm font-bold text-[#15C0B9] drop-shadow-md">
                        2,450 $D1C
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2nd Place Card */}
              <div className="p-6 min-h-[250px]">
                <div className="flex flex-col items-center text-center">
                  {/* School Logo */}
                  <div className="mb-4">
                    <Image
                      src="/divisionlogo2.png"
                      alt="School Logo"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  
                  {/* Position and Details */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                        <div className="text-sm p-2 min-w-[40px] font-bold text-[#15C0B9] drop-shadow-md">2nd</div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-lg font-semibold text-[#E6F0F0] drop-shadow-sm">
                        UCLA Bruins
                      </div>
                      <div className="text-sm font-bold text-[#15C0B9] drop-shadow-md">
                        1,850 $D1C
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place Card */}
              <div className="p-6 min-h-[250px]">
                <div className="flex flex-col items-center text-center">
                  {/* School Logo */}
                  <div className="mb-4">
                    <Image
                      src="/divisionlogo2.png"
                      alt="School Logo"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  
                  {/* Position and Details */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                      <div className="text-sm p-2 min-w-[40px] font-bold text-[#15C0B9] drop-shadow-md">3rd</div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-lg font-semibold text-[#E6F0F0] drop-shadow-sm">
                        Duke Blue Devils
                      </div>
                      <div className="text-sm font-bold text-[#15C0B9] drop-shadow-md">
                        1,275 $D1C
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </DefaultLayout>
  );
}