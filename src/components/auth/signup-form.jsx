import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, User, Mail, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";

export default function SignUpForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  termsAccepted,
  setTermsAccepted,
  handleSubmit,
  isLoading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center bg-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-dark mb-2">
          Create Account
        </h1>
        <p className="text-dark/20 text-lg mb-8">Join our community today</p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-dark mb-2">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40 w-5 h-5" />
              <motion.input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/10 border border-dark text-dark placeholder-dark/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-medium text-dark mb-2">
              Your Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40 w-5 h-5" />
              <motion.input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/10 border border-dark text-dark placeholder-dark/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label className="block text-sm font-medium text-dark mb-2">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40 w-5 h-5" />
              <motion.input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-2.5 rounded-xl bg-white/10 border border-dark text-dark placeholder-dark/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                whileFocus={{ scale: 1.01 }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
          </motion.div>

          {/* Terms Checkbox */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center space-x-2 py-2"
          >
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
              className="border-dark"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-dark/60 cursor-pointer"
            >
              I agree to the terms and conditions
            </label>
          </motion.div>

          <Button className="w-full py-6 text-lg" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : (
              <>
                <UserPlus size={20} className="mr-2" />
                Sign Up
              </>
            )}
          </Button>

          <p className="text-center text-sm text-dark/60 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
