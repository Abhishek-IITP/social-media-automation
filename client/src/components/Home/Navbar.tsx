import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-[#FBF9F6]/80 backdrop-blur-md border-b border-border transition-all duration-200">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" onClick={() => scrollTo(0, 0)} className="flex items-center gap-2">
                    <img src="/logo.svg" alt="logo" className="size-6 opacity-90" />
                    <span className="text-lg font-serif italic font-semibold text-text tracking-tight">NexaPost</span>
                </Link>
                <div className="hidden sm:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    <a href="#features" className="hover:text-primary transition-colors duration-200">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-primary transition-colors duration-200">
                        Process
                    </a>
                    <a href="#pricing" className="hover:text-primary transition-colors duration-200">
                        Pricing
                    </a>
                </div>

                {user ? (
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        Dashboard <ArrowRightIcon className="size-3.5" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text transition-colors duration-200">
                            Sign In
                        </Link>
                        <Link to="/login" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                            Start Free <ArrowRightIcon className="size-3.5" />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
