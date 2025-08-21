// "use client";

// import { useWallet } from "@solana/wallet-adapter-react";
// import { useRouter } from "next/navigation";

// export function useWalletAuthCheck() {
//   const { connected, publicKey } = useWallet();
//   console.log({ connected, publicKey });

//   if (connected && publicKey) {
//     console.log("Wallet connected, setting attempts to 0");
//     localStorage.setItem("walletConnectAttempt", "0");
//   }

//   const router = useRouter();

//   const checkAndLogout = async () => {
//     const storedAuth = localStorage.getItem("siws-auth");
//     if (!storedAuth) return;

//     // Get attempts from storage
//     let attempts = parseInt(localStorage.getItem("walletConnectAttempt") || "0", 10);
//     console.log({ attempts });

//     if (!connected || !publicKey) {
//       console.log("Wallet not connected");
//       attempts += 1;
//       localStorage.setItem("walletConnectAttempt", attempts.toString());
//       console.log(`Wallet not ready. Attempt ${attempts}/5`);

//       if (attempts >= 5) {
//         console.log("Max attempts reached. Logging out...");


//         try {
//           await fetch("/api/auth/logout", { method: "POST" });
//         } catch (err) {
//           console.error("Logout API failed:", err);
//         }

//         // Clear storage
//         localStorage.removeItem("siws-auth");
//         localStorage.removeItem("mfa-completed");
//         localStorage.removeItem("mfa-email");
//         localStorage.removeItem("walletConnectAttempt");

//         router.push("/");
//       }
//     } else {
//       // Wallet connected → reset attempts
//       localStorage.setItem("walletConnectAttempt", "0");
//       console.log("Wallet connected. Resetting attempts.");
//     }
//     console.log("hey...");
//   };

//   return { checkAndLogout, connected, publicKey };
// }