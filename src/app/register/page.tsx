import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthCard from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Join Horologe Royale | Create Account",
  description:
    "Create an account with Horologe Royale to explore exclusive luxury timepiece collections, save wishlist selections, and enjoy priority concierge sourcing.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0] text-[#2C241E] flex flex-col justify-between">
      <Header />
      <div className="pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
        <AuthCard initialMode="signup" />
      </div>
      <Footer hideTopStrip={true} />
    </main>
  );
}

