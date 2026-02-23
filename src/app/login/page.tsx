"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                setShake(true);
                setTimeout(() => setShake(false), 600);
                setLoading(false);
                return;
            }

            router.push("/admin/dashboard");
        } catch {
            setError("Network error. Please try again.");
            setShake(true);
            setTimeout(() => setShake(false), 600);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center relative p-6">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/images/hero/hero-1.jpg')] bg-cover bg-center opacity-10 blur-sm pointer-events-none" />
            <div className="absolute inset-0 bg-white/40 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: shake ? [0, -10, 10, -10, 10, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl p-12 relative z-10 shadow-xl backdrop-blur-xl"
            >
                {/* Logo + Title */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 relative mb-5">
                        <Image
                            src="/images/logos/bjp-logo.png"
                            alt="BJP Logo"
                            fill
                            className="object-contain drop-shadow-sm"
                        />
                    </div>
                    <h1 className="text-[2.5rem] font-bebas text-saffron tracking-[0.15em] leading-none mb-2">
                        Admin Access
                    </h1>
                    <p className="text-slate-500 text-xs font-medium tracking-wider font-tiro">
                        भारतीय जनता पार्टी – यवतमाळ
                    </p>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-saffron/40 to-transparent mt-4" />
                </div>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold pl-1 font-dm">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 text-sm font-dm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-all placeholder:text-slate-400"
                            placeholder="admin@bjpyavatmal.in"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold pl-1 font-dm">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-11 text-slate-900 text-sm font-dm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-all placeholder:text-slate-400"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2 space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-saffron hover:bg-saffron-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-saffron/20 active:scale-[0.98] font-bebas text-lg tracking-[0.1em] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setEmail("demo@bjpyavatmal.in");
                                setPassword("demo123");
                            }}
                            disabled={loading}
                            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-lg transition-all active:scale-[0.98] font-bebas text-lg tracking-[0.1em] flex items-center justify-center shadow-sm"
                        >
                            Use Demo Credentials
                        </button>
                    </div>
                </form>

                <p className="text-center text-slate-400 text-[10px] mt-8 flex items-center justify-center gap-1.5 tracking-wider uppercase">
                    <Lock size={10} />
                    Restricted Access — Authorized Personnel Only
                </p>
            </motion.div>
        </div>
    );
}
