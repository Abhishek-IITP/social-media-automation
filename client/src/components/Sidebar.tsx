import { CalendarDaysIcon, LayoutDashboard, LogOutIcon, UserIcon, Wand2Icon } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
     const { logout, user } = useAuth();
     console.log("Context User:", user);
     const location = useLocation();
     
     const navItems = [
          { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
          { name: "Accounts", icon: UserIcon, path: "/accounts" },
          { name: "Ai Composer", icon: Wand2Icon, path: "/ai-composer" },
          { name: "scheduler", icon: CalendarDaysIcon, path: "/scheduler" }
     ]

     return (
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#FBF9F6] border-r border-border flex flex-col h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
               {/* Editorial Brand Header */}
               <div className="p-6 pb-6">
                    <div className="text-md font-serif italic font-semibold text-text flex items-center gap-2">
                         <img src="/logo.svg" alt="logo" className="size-5 opacity-95" /> NexaPost
                    </div>
               </div>

               {/* Navigation Links */}
               <nav className="flex-1 px-4 space-y-1 pt-2">
                    <div className="px-3 mb-2">
                         <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Navigation</span>
                    </div>

                    {navItems.map((item) => {
                         const isActive = location.pathname === item.path;
                         return (
                              <NavLink 
                                   key={item.name}
                                   to={item.path}
                                   end={item.path === "/dashboard"}
                                   onClick={() => {
                                        setIsOpen(false)
                                   }}
                                   className={`relative flex gap-3.5 items-center px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                                        isActive 
                                             ? 'bg-white text-primary border-border shadow-xs' 
                                             : "text-text-secondary hover:bg-white/40 border-transparent hover:text-text"
                                   }`}
                              >
                                   <item.icon className={`size-4.5 shrink-0 ${isActive ? "text-primary" : "text-text-muted group-hover:text-text-secondary"}`} />
                                   {item.name}
                                   
                                   {isActive && (
                                        <motion.span 
                                             layoutId="sidebarActiveIndicator"
                                             className="absolute left-0 w-1 h-5 rounded-r bg-primary"
                                        />
                                   )}
                              </NavLink>
                         )
                    })}
               </nav>

               {/* Footer / Account section */}
               <div className="p-4 border-t border-border bg-[#F5F2EA]/30">
                    <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-2xl shadow-xs"> 
                         <div className="size-8.5 rounded-xl bg-primary-light text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary-light">
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                         </div>

                         <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-text truncate leading-tight">{user?.name}</div>
                              <div className="text-[9px] text-text-muted truncate mt-0.5 font-medium leading-none">{user?.email}</div>
                         </div>
                    </div>
                    
                    <button 
                         onClick={logout} 
                         className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-xl text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:bg-primary hover:text-white border border-border hover:border-primary transition-all duration-200 cursor-pointer shadow-xs"
                    >
                         <LogOutIcon className="size-3.5" />
                         Sign Out
                    </button>
               </div>
          </div>
     )
}
