import { CalendarIcon, CheckCircleIcon, ClockIcon, Send, Share2Icon, SquarePen, TrendingUp, UploadIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { dummyAccountsData, dummyActivityData, dummyPostsData } from "../assets/assets"



export function DashBoard(){

     const [stats,setStats] = useState({scheduled: 0, published: 0, connectedAccounts: 0, })
     const [activity,setActivity] = useState<any[]>([])
     

     useEffect(()=>{
          const fetchDashboardData = async()=>{
               try{
               const [postsRes,accountsRes,activityRes] = [{data: dummyPostsData}, {data: dummyAccountsData}, {data: dummyActivityData}]
               const posts = postsRes.data;
               const accounts = accountsRes.data;
               setStats({
                    scheduled: posts.filter((p:any)=>p.status==="scheduled").length,
                    published: posts.filter((p:any)=>p.status==="published").length,
                    connectedAccounts: accounts.length,
               })
               setActivity(activityRes.data)
               }catch(error){
                    console.log(error)
               }
          }
          fetchDashboardData()
     },[])

     const statCards = [
          {
               label: 'Scheduled Posts',
               value: stats.scheduled,
               icon: ClockIcon,
               trend: "+2 today" 
          },
          {
               label: 'Published Posts',
               value: stats.published,
               icon: CheckCircleIcon,
               trend: "All time" 
          },
          {
               label: 'Connected Accounts',
               value: stats.connectedAccounts,
               icon: Share2Icon,
               trend: "Active" 
          }
     ]

     return <div className="space-y-8   ">
          <div>
               <h2 className="text-2xl text-slate-800 font-medium">Good Morning</h2>
               <p className="text-slate-500 text-sm mt-0.5">
                    Here's what's happening with your social accounts today
               </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

               {statCards.map((card, index) => (
                    <div 
                         key={index} 
                         className="bg-white hover:bg-red-50 relative border border-slate-200 rounded-2xl p-5 hover:border-red-200 tranisition-all duration-300 group"
                    >
                         <div className="flex items-center justify-between mb-4">
                              <div className="text-3xl font-medium text-slate-800 tabular-nums">{card.value}</div>

                              <div className="text-sm absolute right-4 top-4 flex items-center gap-1 text-red-500">
                                   <TrendingUp className="size-4" /> {card.trend}
                              </div>

                         </div>
                         <p className="text-sm mt-1 text-slate-500">{card.label}</p>
                         
                    </div>
               ))}

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
               <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-slate-900">Recent Activity</h2>
                    <span className="text-sm text-slate-400">{activity.length} events</span>
               </div>

               {activity.length === 0 ? (
                    <div className="p-8 text-center">
                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <ClockIcon className="size-8 text-slate-400" />
                         </div>
                         <h3 className="text-lg font-semibold text-slate-800 mb-2">No Activity Yet</h3>
                         <p className="text-slate-500 text-sm max-w-md mx-auto">
                              Once you start scheduling posts or Reels, you'll see your recent activity here.
                         </p>
                    </div>
               ) : (    
                    <div className="flex flex-col">
                         {activity.map((event, index) => (
                              <div key={index} className="flex items-center justify-between px-6 py-4">
                                   <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100/70 rounded-xl flex items-center justify-center">
                                             <Send className="size-4 text-slate-500" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                             <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 w-fit">
                                                  Published
                                             </span>
                                             <p className="text-sm text-slate-700">{event.description}</p>
                                        </div>
                                   </div>
                                   <div className="text-xs text-slate-400">
                                        {new Date(event.createdAt).toLocaleString('en-US')}
                                   </div>
                              </div>
                         ))}
                    </div>
               )}
               
          </div>

 
          
     </div>
}