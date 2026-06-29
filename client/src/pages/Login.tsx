import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, LockIcon, ArrowRightIcon, User2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Login() {
    const [loginState, setLoginState] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { login, user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post(`/api/auth/${loginState ? "login" : "register"}`, {
                name, email, password
            })
            login(data.user, data.token)
            navigate("/dashboard")
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (user) navigate("/dashboard")
    }, [user])

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                    <div className="flex flex-col items-center mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.svg" alt="Logo" className="size-6.5" />
                            <h1 className="text-2xl font-heading text-text">Scheduler</h1>
                        </Link>
                        <p className="text-text-secondary text-sm mt-1">Sign in to your Dashboard</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                        {!loginState && (
                            <div>
                                <label className="block mb-1.5 text-text-secondary font-medium">Name</label>
                                <div className="relative">
                                    <User2Icon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Enter your name" 
                                        className="w-full pl-10 pr-4 py-2.5 bg-bg focus:bg-white border border-border focus:border-primary focus:outline-none rounded-full transition-all duration-200" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                    />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block mb-1.5 text-text-secondary font-medium">Email</label>
                            <div className="relative">
                                <MailIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="you@company.com" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-bg focus:bg-white border border-border focus:border-primary focus:outline-none rounded-full transition-all duration-200" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1.5 text-text-secondary font-medium">Password</label>
                            <div className="relative">
                                <LockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input 
                                    type="password" 
                                    required 
                                    placeholder="********" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-bg focus:bg-white border border-border focus:border-primary focus:outline-none rounded-full transition-all duration-200" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-full text-sm font-medium transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                        >
                            {loading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    {loginState ? "Sign In" : "Sign Up"} <ArrowRightIcon className="size-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-text-secondary">
                        {loginState ? (
                            <>
                                Don't have an account?{" "}
                                <button onClick={() => setLoginState(false)} className="text-primary hover:text-primary-hover font-medium">
                                    Create one free
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setLoginState(true)} className="text-primary hover:text-primary-hover font-medium">
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
