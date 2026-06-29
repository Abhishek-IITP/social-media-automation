import { CheckCircleIcon, ClockIcon, Send, Share2Icon, Sparkles, Activity } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "../api/axios"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export function DashBoard() {
     const [stats, setStats] = useState({ scheduled: 0, published: 0, connectedAccounts: 0 })
     const [activity, setActivity] = useState<any[]>([])

     useEffect(() => {
          const fetchDashboardData = async () => {
               try {
                    const [postsRes, accountsRes, activityRes] = await Promise.all([
                         api.get("/api/posts"),
                         api.get("/api/accounts"),
                         api.get("/api/activity")
                    ])
                    const posts = postsRes.data;
                    const accounts = accountsRes.data;
                    setStats({
                         scheduled: posts.filter((p: any) => p.status === "scheduled").length,
                         published: posts.filter((p: any) => p.status === "published").length,
                         connectedAccounts: accounts.length,
                    })
                    setActivity(activityRes.data)
               } catch (error) {
                    console.log(error)
               }
          }
          fetchDashboardData()
     }, [])

     const statCards = [
          { label: "Scheduled", value: stats.scheduled, icon: ClockIcon, bg: "bg-amber-50", iconColor: "text-amber-600", border: "border-amber-100" },
          { label: "Published", value: stats.published, icon: CheckCircleIcon, bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-100" },
          { label: "Accounts", value: stats.connectedAccounts, icon: Share2Icon, bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100" },
     ]

     const hour = new Date().getHours()
     const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

     return (
          <div className="max-w-4xl space-y-10">
               {/* Greeting */}
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <h1 className="text-3xl font-serif text-text">{greeting}</h1>
                    <p className="text-text-secondary mt-2 text-[15px]">Here's an overview of your social media activity.</p>
               </motion.div>

               {/* Stats */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {statCards.map((card, i) => (
                         <motion.div
                              key={card.label}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: i * 0.06 }}
                              className={`rounded-2xl border ${card.border} ${card.bg} p-6 flex items-start justify-between`}
                         >
                              <div>
                                   <p className="text-[13px] font-medium text-text-secondary">{card.label}</p>
                                   <p className="text-4xl font-semibold text-text mt-2 tabular-nums">{card.value}</p>
                              </div>
                              <div className={`size-10 rounded-xl flex items-center justify-center ${card.iconColor} bg-white/70`}>
                                   <card.icon className="size-5" />
                              </div>
                         </motion.div>
                    ))}
               </div>

               {/* Quick Actions */}
               <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3">
                    <Link to="/ai-composer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm">
                         <Sparkles className="size-4" /> Create with AI
                    </Link>
                    <Link to="/scheduler" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-text border border-border text-sm font-medium hover:bg-bg transition-colors">
                         <ClockIcon className="size-4" /> Schedule a Post
                    </Link>
                    <Link to="/accounts" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-text border border-border text-sm font-medium hover:bg-bg transition-colors">
                         <Share2Icon className="size-4" /> Manage Accounts
                    </Link>
               </motion.div>

               {/* Activity Feed */}
               <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <div className="flex items-center justify-between mb-4">
                         <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                              <Activity className="size-5 text-text-muted" /> Recent Activity
                         </h2>
                         <span className="text-sm text-text-muted">{activity.length} events</span>
                    </div>

                    <div className="bg-white rounded-2xl border border-border overflow-hidden">
                         {activity.length === 0 ? (
                              <div className="py-16 text-center">
                                   <ClockIcon className="size-8 text-border mx-auto mb-3" />
                                   <p className="text-text-secondary font-medium">No activity yet</p>
                                   <p className="text-sm text-text-muted mt-1">Schedule or publish a post to see activity here.</p>
                              </div>
                         ) : (
                              <div className="divide-y divide-border">
                                   {activity.map((event, i) => (
                                        <div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-bg/50 transition-colors">
                                             <div className="size-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                                  <Send className="size-4 text-emerald-600" />
                                             </div>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-sm text-text font-medium">{event.description}</p>
                                                  <p className="text-xs text-text-muted mt-1">
                                                       {new Date(event.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                  </p>
                                             </div>
                                             <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full shrink-0">Published</span>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>
               </motion.div>
          </div>
     )
}
