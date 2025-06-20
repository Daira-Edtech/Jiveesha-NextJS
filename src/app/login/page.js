"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      if (error) {
        setErrors((prev) => ({
          ...prev,
          server: error.message || "Login failed. Please check your credentials.",
        }));
      } else if (data) {
        router.push("/dashboard");
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        server: err.message || "An unexpected error occurred during login.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-blue-100 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          Welcome Back!
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        {errors.server && (
          <Alert variant="destructive">
            <AlertDescription>{errors.server}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Parent Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 h-12 border-2 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-400"
                } rounded-lg text-lg`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Secret Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 h-12 border-2 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-400"
                } rounded-lg text-lg`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="link"
              className="text-sm text-blue-600 hover:text-blue-500 p-0"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-lg rounded-lg transition-all duration-200 transform hover:scale-[1.01] shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Signing In...
              </div>
            ) : (
              <div className="flex items-center">
                <LogIn className="-ml-1 mr-2 h-5 w-5" />
                Let&apos;s Learn!
              </div>
            )}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Learn, Play, Grow
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-medium text-lg rounded-lg transition-all duration-200 transform hover:scale-[1.01]"
          onClick={() => router.push("/register")}
        >
          Create New Account
        </Button>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-yellow-200/30 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-blue-200/30 blur-xl"></div>
      <div className="absolute top-1/2 left-20 w-12 h-12 rounded-full bg-purple-200/20 blur-lg"></div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <Image
              src="/daira-logo1.png"
              alt="Daira Logo"
              width={56}
              height={48}
              className="rounded-xl"
              priority
            />
            <h1 className="text-3xl font-bold ml-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Daira 
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-blue-600 mb-2">
            Learn, Play, Grow
          </h2>
          <p className="text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
