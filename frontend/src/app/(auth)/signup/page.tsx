"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { auth } from "@/lib/auth";
import { CheckCircle, Clock, ListTodo, Shield } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth.isAuthenticated()) {
        router.replace("/dashboard");
      } else {
        setIsChecking(false);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-indigo-700 to-purple-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">Join TaskFlow</h1>
          <p className="text-xl text-cyan-100">
            Start managing your tasks efficiently today.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Secure & Private</h3>
              <p className="text-cyan-200 text-sm">Your data is encrypted and protected at all times</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <ListTodo className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Easy to Use</h3>
              <p className="text-cyan-200 text-sm">Intuitive interface designed for productivity</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Get Things Done</h3>
              <p className="text-cyan-200 text-sm">Focus on what matters and complete tasks faster</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-cyan-200 text-sm">
            © 2026 TaskFlow. Empowering productivity.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
