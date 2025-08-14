import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import WalletConnectButton from "@/components/WalletConnectButton";
import SelectSchoolModal from "@/components/SelectSchoolModal";
import Image from "next/image";
import { useSIWS } from "@/hooks/useSIWS";
import { usePathname } from "next/navigation";
import { checkFullAuth } from "@/lib/auth-utils";
import { fetchUserData } from "@/lib/api";
import { UserData } from "@/types/api";
import { useWallet } from "@solana/wallet-adapter-react";

const Navbar = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isDashboard, setIsDashboard] = useState(false);
  const { connected, isAuthenticated } = useSIWS();
  const { publicKey } = useWallet();
  const pathname = usePathname();

  // Modal and user data state
  const [isSelectSchoolModalOpen, setIsSelectSchoolModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdminPath, setIsAdminPath] = useState(false);
  // Check for full authentication (wallet + MFA)
  useEffect(() => {
    setIsFullyAuthenticated(checkFullAuth(connected, isAuthenticated) || false);
  }, [connected, isAuthenticated]);

  // Fetch user data when wallet is connected
  useEffect(() => {
    if (isFullyAuthenticated) {
      const loadUserData = async () => {
        if (!publicKey) {
          setUserData(null);
          return;
        }

        try {
          const { data, error } = await fetchUserData(publicKey.toString());
          if (error) {
            console.error("Error loading user data:", error);
          } else if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      };
      loadUserData();
    }
  }, [publicKey, isFullyAuthenticated]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (pathname === "/dashboard") {
      setIsDashboard(true);
    } else {
      setIsDashboard(false);
    }

    if (pathname === "/admin") {
      setIsAdminPath(true);
    } else {
      setIsAdminPath(false);
    }
  }, [pathname]);

  // Create a sentinel element for scroll detection
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Create a sentinel element at the top of the page
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "0";
    sentinel.style.height = "1px";
    sentinel.style.width = "100%";
    sentinel.style.pointerEvents = "none";
    document.body.prepend(sentinel);
    sentinelRef.current = sentinel;

    // Initialize the intersection observer
    const options = {
      threshold: [0, 0.1, 0.2, 1.0],
      rootMargin: "0px",
    };

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrollingUp = lastScrollY > currentScrollPos;
          const isAtTop = currentScrollPos < 10;

          setVisible(isScrollingUp || isAtTop);

          lastScrollY = currentScrollPos;
          ticking = false;
        });

        ticking = true;
      }
    };

    // Set up intersection observer for the top of the page
    observerRef.current = new IntersectionObserver((entries) => {
      // When sentinel enters/exits the viewport, update navbar visibility
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else {
          // When not at the top, use scroll direction to determine visibility
          handleScroll();
        }
      });
    }, options);

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    // Add scroll event for scroll direction detection
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (observerRef.current && sentinelRef.current) {
        observerRef.current.unobserve(sentinelRef.current);
        observerRef.current.disconnect();
      }

      if (sentinelRef.current && sentinelRef.current.parentNode) {
        sentinelRef.current.parentNode.removeChild(sentinelRef.current);
      }
    };
  }, []);

  return (
    <header
      className={`fixed top-0 z-999 flex w-full bg-white/0 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-grow items-center justify-between m-3 px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-white/20 bg-white/10 backdrop-blur-md p-1.5 shadow-lg lg:hidden hover:bg-white/20 transition-all duration-200"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-[#E6F0F0] delay-[0] duration-200 ease-in-out border border-[#E6F0F0] ${
                    !mobileMenuOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-[#E6F0F0] delay-150 duration-200 ease-in-out border border-[#E6F0F0] ${
                    !mobileMenuOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-[#E6F0F0] delay-200 duration-200 ease-in-out border border-[#E6F0F0] ${
                    !mobileMenuOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-[#E6F0F0] delay-300 duration-200 ease-in-out ${
                    !mobileMenuOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-[#E6F0F0] duration-200 ease-in-out ${
                    !mobileMenuOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}
        </div>

        {/* Division One logo - hidden on small screens */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-2">
            <li>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/divisionlogo2.png"
                  alt="Division One Logo"
                  width={20}
                  height={20}
                />
                <p className="text-[#15C0B9] font-medium hover:text-[#E6F0F0] transition-colors duration-200">
                  DIVISION ONE
                </p>
              </Link>
            </li>
            <li className="text-[#E6F0F0] ml-1">|</li>
            {isFullyAuthenticated && !isDashboard && (
              <li>
                <Link
                  href="/dashboard"
                  className="mx-1 text-[#E6F0F0] hover:text-[#15C0B9] font-medium transition-all duration-200 flex items-center py-2 rounded-md backdrop-blur-sm"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {isFullyAuthenticated && !isAdminPath && (
              <li>
                <Link
                  href="/admin"
                  className="mx-1 text-[#E6F0F0] hover:text-[#15C0B9] font-medium transition-all duration-200 flex items-center py-2 rounded-md backdrop-blur-sm"
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Division One logo - visible only on small screens, positioned to the right */}
        <div className="lg:hidden ml-auto">
          <Link
            href="/"
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
          >
            <Image
              src="/divisionlogo2.png"
              alt="Division One Logo"
              width={20}
              height={20}
            />
            <p className="text-[#15C0B9] hover:text-[#E6F0F0] transition-colors duration-200">
              DIVISION ONE
            </p>
          </Link>
        </div>

        {/* Desktop navigation menu */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-8 2xsm:gap-4">
            <li>
              <WalletConnectButton
                setIsSelectSchoolModalOpen={setIsSelectSchoolModalOpen}
              />
            </li>
          </ul>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full sm:w-1/2 bg-white/5 backdrop-blur-xl shadow-2xl mt-1 py-2 lg:hidden z-50 rounded-md">
            <ul className="flex flex-col space-y-3 px-4">
              {isFullyAuthenticated && !isDashboard && (
                <li>
                  <Link
                    href="/dashboard"
                    className="text-[#E6F0F0] hover:text-[#15C0B9] py-2 transition-all duration-200 flex items-center gap-2 px-3 rounded-md hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              {isFullyAuthenticated && !isAdminPath && (
                <li>
                  <Link
                    href="/admin"
                    className="text-[#E6F0F0] hover:text-[#15C0B9] py-2 transition-all duration-200 flex items-center gap-2 px-3 rounded-md hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </li>
              )}
              {isFullyAuthenticated && (
                <li>
                  <button
                    onClick={() => {
                      setIsSelectSchoolModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer w-full text-left px-3 py-2 bg-[#15C0B9] hover:bg-[#15C0B9]/90 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m-3 0h-5m2-5h9m-9 0v-5"
                      />
                    </svg>
                    Select School
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {isFullyAuthenticated && (
        <SelectSchoolModal
          isOpen={isSelectSchoolModalOpen}
          onClose={() => setIsSelectSchoolModalOpen(false)}
          userId={userData?.data.id.toString() || ""}
          linkedCollege={userData?.data.currentLinkedCollege || null}
          setUserData={setUserData}
        />
      )}
    </header>
  );
};

export default Navbar;
