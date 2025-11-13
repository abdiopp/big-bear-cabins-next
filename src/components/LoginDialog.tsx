"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type LoginMode = "phone" | "email" | "signup";

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function LoginDialog({ isOpen, onOpenChange, trigger }: LoginDialogProps) {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US");
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

  const getCountryData = (code: string) => {
    const countries = {
      US: { name: "United States", code: "+1", flag: "🇺🇸" },
      CA: { name: "Canada", code: "+1", flag: "🇨🇦" },
      GB: { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
      AU: { name: "Australia", code: "+61", flag: "🇦🇺" },
      DE: { name: "Germany", code: "+49", flag: "🇩🇪" },
      FR: { name: "France", code: "+33", flag: "🇫🇷" },
      ES: { name: "Spain", code: "+34", flag: "🇪🇸" },
      IT: { name: "Italy", code: "+39", flag: "🇮🇹" },
      JP: { name: "Japan", code: "+81", flag: "🇯🇵" },
      KR: { name: "South Korea", code: "+82", flag: "🇰🇷" },
    };
    return countries[code as keyof typeof countries] || countries.US;
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement phone login logic
      const fullPhoneNumber = `${getCountryData(countryCode).code}${phoneNumber}`;
      console.log("Phone login attempted with:", fullPhoneNumber);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful login
      onOpenChange(false);
      setPhoneNumber("");
    } catch (error) {
      console.error("Phone login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    setPhoneNumber("");
    setError("");
    setSuccessMessage("");
    setMode("phone");
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

          {/* Phone Login Mode */}
          {mode === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              {/* Country Code and Phone Number */}
              <div className="space-y-3">
                <div className="relative">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCountryData(countryCode).flag}</span>
                          <span className="text-gray-900 font-medium">
                            {getCountryData(countryCode).name} ({getCountryData(countryCode).code})
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">
                        <div className="flex items-center space-x-2">
                          <span>🇺🇸</span>
                          <span>United States (+1)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="CA">
                        <div className="flex items-center space-x-2">
                          <span>🇨🇦</span>
                          <span>Canada (+1)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="GB">
                        <div className="flex items-center space-x-2">
                          <span>🇬🇧</span>
                          <span>United Kingdom (+44)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="AU">
                        <div className="flex items-center space-x-2">
                          <span>🇦🇺</span>
                          <span>Australia (+61)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="DE">
                        <div className="flex items-center space-x-2">
                          <span>🇩🇪</span>
                          <span>Germany (+49)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FR">
                        <div className="flex items-center space-x-2">
                          <span>🇫🇷</span>
                          <span>France (+33)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ES">
                        <div className="flex items-center space-x-2">
                          <span>🇪🇸</span>
                          <span>Spain (+34)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="IT">
                        <div className="flex items-center space-x-2">
                          <span>🇮🇹</span>
                          <span>Italy (+39)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="JP">
                        <div className="flex items-center space-x-2">
                          <span>🇯🇵</span>
                          <span>Japan (+81)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="KR">
                        <div className="flex items-center space-x-2">
                          <span>🇰🇷</span>
                          <span>South Korea (+82)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone number"
                    className="w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="text-sm text-gray-600 leading-relaxed">
                We'll call or text you to confirm your number. Standard message and data rates apply.{" "}
                <button type="button" className="underline hover:no-underline font-medium">
                  Privacy Policy
                </button>
              </div>

              {/* Continue Button */}
              <Button
                type="submit"
                className="w-full h-12 text-white bg-black hover:bg-gray-800 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Continue"}
              </Button>

              {/* Alternative Login Option */}
              <div className="pt-4">
                <div className="flex items-center justify-center space-x-4 text-gray-400 mb-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-sm font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border border-gray-300 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                  onClick={() => setMode("email")}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">✉️</span>
                    <span>Continue with email</span>
                  </div>
                </Button>
              </div>
            </form>
          )}

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

              {/* Alternative Login Option */}
              <div className="pt-4">
                <div className="flex items-center justify-center space-x-4 text-gray-400 mb-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-sm font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border border-gray-300 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                  onClick={() => setMode("phone")}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">📱</span>
                    <span>Continue with phone</span>
                  </div>
                </Button>
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
