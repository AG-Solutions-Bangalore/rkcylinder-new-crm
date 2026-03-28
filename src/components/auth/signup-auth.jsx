import { motion } from "framer-motion";
import { useState } from "react";
import BackgroundSVG from "./background-svg";
import Carousel from "./carousel";
import SignUpForm from "./signup-form";

const testimonials = [
  {
    image:
      "https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "Join the Innovation",
    description:
      "Experience the next generation of workspace comfort and design.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1616628182501-9f5b3cda2d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "For Every Professional",
    description:
      "Our solutions are built to support your productivity and well-being.",
  },
];

export default function SignUpAuth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const handleCarouselChange = (index) => {
    setTestimonialIndex(index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only for now as requested
    console.log("Sign Up submitted:", { name, email, password, termsAccepted });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      <BackgroundSVG />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-6xl w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white shadow-2xl">
          <Carousel
            testimonials={testimonials}
            testimonialIndex={testimonialIndex}
            handleCarouselChange={handleCarouselChange}
          />
          <SignUpForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            handleSubmit={handleSubmit}
            isLoading={false}
          />
        </div>
      </motion.div>
    </div>
  );
}
