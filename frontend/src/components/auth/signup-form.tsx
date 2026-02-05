"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User as UserIcon, Mail, Lock, ArrowRight } from "lucide-react";

import { authService } from "@/lib/auth-service";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterValues) {
    if (!mounted) return;

    setIsLoading(true);
    try {
      await authService.signUp({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      toast.success("Account created successfully!");
      // Use Next.js router for client-side navigation (preserves state)
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      setIsLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <Card className="w-full border-0 shadow-2xl">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
          Create Your Account
        </CardTitle>
        <CardDescription className="text-center text-base">
          Get started with TaskFlow today
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Full Name
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                placeholder="John Doe"
                {...form.register("name")}
                disabled={isLoading}
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 font-medium">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...form.register("email")}
                disabled={isLoading}
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 font-medium">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                {...form.register("password")}
                disabled={isLoading}
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-600 font-medium">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              "Creating account..."
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pb-8">
        <div className="text-sm text-gray-600 w-full text-center">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
