"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type LoginMode = "email" | "signup";

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function LoginDialog({ isOpen, onOpenChange, trigger }: LoginDialogProps) {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      if (result?.ok) {
        setSuccessMessage("You have been logged in successfully.");
        setTimeout(() => {
          onOpenChange(false);
          resetForm();
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error("Email login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.details || data.error || "Signup failed");
        return;
      }

      // Auto-login after successful signup
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.ok) {
        setSuccessMessage("Your account has been created successfully!");
        setTimeout(() => {
          onOpenChange(false);
          resetForm();
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setError("");
    setSuccessMessage("");
    setMode("email");
  };

  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white rounded-3xl border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{mode === "signup" ? "Sign up" : "Log in or sign up"}</DialogTitle>
          <DialogDescription>
            {mode === "signup"
              ? "Create your Big Bear Cabins account to start booking your dream vacation."
              : "Log in or sign up to your Big Bear Cabins account to access your bookings and preferences."}
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-center p-6 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{mode === "signup" ? "Sign up" : "Log in or sign up"}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">Welcome to Big Bear Cabins</h3>

          {/* Email Login Mode */}
          {mode === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
              )}
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                  {successMessage}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mt-1"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-14 px-4 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 underline hover:no-underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 text-white bg-black hover:bg-gray-800 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-semibold text-black hover:underline"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </div>

            </form>
          )}

          {/* Signup Mode */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
              )}
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                  {successMessage}
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mt-1"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mt-1"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mt-1"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full h-14 px-4 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                      minLength={8}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                    Confirm password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full h-14 px-4 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="text-sm text-gray-600 leading-relaxed">
                By selecting <span className="font-semibold">Agree and continue</span>, I agree to Big Bear Cabins'{" "}
                <button type="button" className="underline hover:no-underline font-medium">
                  Terms of Service
                </button>
                ,{" "}
                <button type="button" className="underline hover:no-underline font-medium">
                  Payments Terms of Service
                </button>
                , and{" "}
                <button type="button" className="underline hover:no-underline font-medium">
                  Privacy Policy
                </button>
                .
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full h-12 text-white bg-black hover:bg-gray-800 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Agree and continue"}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("email")}
                  className="font-semibold text-black hover:underline"
                  disabled={isLoading}
                >
                  Log in
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
