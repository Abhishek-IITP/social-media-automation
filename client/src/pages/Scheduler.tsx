import { useEffect, useState } from "react"
import { dummyPostsData, PLATFORMS } from "../assets/assets";

export function Scheduler(){

     const [posts , setPosts] = useState<any[]>([]);
     const [content, setContent] = useState("")
     const [scheduledDate, setScheduledDate] = useState("")
     const [scheduledTime, setScheduledTime] = useState("")
     const [scheduledPlatform, setScheduledPlatform] = useState<string[]>([]);

     const [mediaFile, setMediaFile] = useState<File | null>(null);


     const [loading, setLoading] = useState(false);


     const fetchPosts=async()=>{
         setPosts(dummyPostsData);
     }    

     useEffect(()=>{
         
          (async()=>fetchPosts())();

          const interval = setInterval(async()=> await fetchPosts(),1000);
          return ()=>clearInterval(interval);
     },[])


     const togglePlatform =(id:string)=>{
          setScheduledPlatform((prev)=>prev.includes(id)? prev.filter((p)=>p !==id):[...prev,id])
     }

     const handleSchedule = async(e:React.FormEvent)=>{
          e.preventDefault();
          setLoading(true);
          setTimeout(()=>{
               setLoading(false);
               setPosts((prev)=>([...prev,dummyPostsData[0]]))
          },1000)
          
     }

     
     const scheduled = posts.filter((e)=>e.status ==="scheduled")
     const published= posts.filter((e)=>e.status ==="published")
     return <div className="flex flex-col lg:flex-row gap-6 h-full">
          
          <div className="w-full lg:w-[460px] shrink-0">
               <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                         <h4 className="text-lg font-semibold text-slate-800">Schedule Post</h4>
                         <p className="text-sm text-slate-600 mt-1">Create a new post and schedule it for future publication across your connected platforms.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSchedule}>

                         <div>
                              <label htmlFor="platform" className="block text-sm font-semibold uppercase text-slate-700 mb-1">Platform</label>
                              <div className="flex flex-wrap gap-3">
                                   {PLATFORMS.map((e)=>{
                                        const active=scheduledPlatform.includes(e.id);
                                        return(
                                             <button 
                                             onClick={()=>togglePlatform(e.id)}
                                             type="button" key={e.id} className={`flex items-center gap-1.5 p-3 rounded-md border tranistion-all duration-150 ${active? "bg-red-50 border-red-200 text-red-600 scale-103" : "border-slate-200 bg-white text-slate-600  hover:border-slate-300"}`}>
                                                  <e.icon className="size-4.5"/>
                                             </button>
                                        )
                                   })}
                              </div>
                         </div>

                    </form>
               </div>

          </div>
     </div>
}