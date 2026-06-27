import { useEffect, useState } from "react"
import { dummyPostsData, PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarDaysIcon, CheckCircleIcon, XIcon } from "lucide-react";

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
               const newPost = {
                    _id: Math.random().toString(36).substring(2, 11),
                    content: content,
                    platforms: scheduledPlatform,
                    scheduledFor: `${scheduledDate}T${scheduledTime}`,
                    status: "scheduled",
                    mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : undefined,
                    mediaType: mediaFile ? (mediaFile.type.startsWith("image/") ? "image" : "video") : undefined,
                    createdAt: new Date().toISOString()
               };
               setPosts((prev)=>([...prev, newPost]));
               
               // Reset form fields
               setContent("");
               setScheduledPlatform([]);
               setScheduledDate("");
               setScheduledTime("");
               setMediaFile(null);
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

                         <div>
                              <label htmlFor="content" className="block text-sm font-semibold uppercase text-slate-500 mb-2">Content</label>
                              <textarea required rows={5} id="content" value={content} onChange={(e)=>setContent(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:ring-2 resize-none focus:ring-red-500 transition-all duration-150" placeholder="What do you want to share?"/> 
                              <div className={`text-right text-xs mt-1 font-medium ${content.length >280 ? "text-red-500" : "text-slate-500"}`}>
                                   {content.length}/280
                              </div>
                         </div>

                         <div>
                              <label className="block text-sm font-semibold uppercase text-slate-500 mb-2">Media (optional)</label>
                              {mediaFile ? (
                                   <div className="relative w-full rounded-2xl overflow-hidden group">
                                        {mediaFile.type.startsWith("image/") ? (
                                             <img 
                                                  src={URL.createObjectURL(mediaFile)} 
                                                  alt="Preview" 
                                                  className="w-full object-cover rounded-2xl" 
                                             />
                                        ) : (
                                             <video 
                                                  src={URL.createObjectURL(mediaFile)} 
                                                  controls 
                                                  className="w-full object-cover rounded-2xl" 
                                             />
                                        )}
                                        <button 
                                             type="button" 
                                             onClick={()=>setMediaFile(null)} 
                                             className="absolute top-3 right-3 size-8 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-all duration-150 flex items-center justify-center cursor-pointer shadow-md"
                                        >
                                             <XIcon className="size-4"/>
                                        </button>
                                   </div>
                              ) : (
                                   <>
                                        <label 
                                             htmlFor="media" 
                                             className="flex items-center justify-center w-full h-32 border border-dashed border-[#e6b8be] rounded-2xl cursor-pointer bg-transparent hover:bg-red-50/10 transition-all duration-150"
                                        >
                                             <span className="text-[#ab303e] font-medium text-base">
                                                  Click to upload image or video
                                             </span>
                                        </label>
                                        <input 
                                             type="file" 
                                             id="media" 
                                             accept="image/*,video/*" 
                                             onChange={(e)=>setMediaFile(e.target.files?.[0] || null)} 
                                             className="hidden" 
                                        />
                                   </>
                              )}
                         </div>

                         <div>
                              <label htmlFor="scheduledDate" className="block text-sm font-semibold uppercase text-slate-700 mb-1">Scheduled Date</label>
                              <input type="date" required id="scheduledDate" value={scheduledDate} onChange={(e)=>setScheduledDate(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-150" />
                         </div>

                         <div>
                              <label htmlFor="scheduledTime" className="block text-sm font-semibold uppercase text-slate-700 mb-1">Scheduled Time</label>
                              <input type="time" required id="scheduledTime" value={scheduledTime} onChange={(e)=>setScheduledTime(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-150" />
                         </div>

                         <button type="submit" disabled={loading} className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-150">{loading ?(
                              <div className="flex items-center justify-center gap-5">
                               <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Scheduling...
                              </div>
                         ) : 
                         (
                              <div className="flex items-center justify-center gap-3">
                              Schedule Post <ArrowRightIcon className="size-4 ml-1.5"/></div>
                              )}
                              </button>
                    </form>   
               </div>

          </div>


          <div className="flex-1 flex flex-col gap-6 min-w-0"> 

               <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-6 space-y-6">
                         <div className="flex items-center gap-2.5 px-5 py-4 border-slate-100">
                              <CalendarDaysIcon className="text-[#ab303e] size-5"/>
                              <h3 className="text-sm text-slate-900 font-bold uppercase tracking-wider">Upcoming Posts</h3>
                              <span className="ml-auto font-bold text-sm font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
                                   {scheduled.length}
                              </span>
                         </div>

                         <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">

                              {scheduled.length ===0?(
                                   <div className="py-10 text-center text-slate-400 text-sm">No Posts scheduled yet</div>
                              ):(
                                   
                                   scheduled.map((post)=>(
                                        <div key={post._id} className="py-4 px-5 hover:bg-slate-50/60 transition-colors duration-150 flex gap-4 items-start border-b border-slate-50 last:border-0">
                                             <div className="flex-1 min-w-0 space-y-2">
                                                  <div className="flex items-center justify-between">
                                                       <div className="flex gap-1.5 items-center">
                                                            {(post.platforms || []).map((pl:string)=>{
                                                                 const meta = PLATFORMS.find((p)=>p.id === pl);
                                                                 return meta ? <meta.icon key={pl} className="size-4 text-slate-400" /> : null;
                                                            })}
                                                       </div>
                                                       <span className="text-xs text-slate-400">
                                                            {post.scheduledFor ? new Date(post.scheduledFor).toLocaleString() : ""}
                                                       </span>
                                                  </div>
                                                  
                                                  <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
                                                  
                                                  {post.mediaType && (
                                                       <span className="inline-block text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-xl font-semibold capitalize">
                                                            {post.mediaType}
                                                       </span>
                                                  )}
                                             </div>
                                             
                                             {post.mediaUrl && (
                                                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                                                       {post.mediaType === "video" ? (
                                                            <video src={post.mediaUrl} className="w-full h-full object-cover" />
                                                       ) : (
                                                            <img src={post.mediaUrl} alt="media" className="w-full h-full object-cover" />
                                                       )}
                                                  </div>
                                             )}
                                        </div>
                                   ))
                              )}   
                              
                         </div>
                    </div>
                    
               </div>

               <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-6 space-y-6">
                         <div className="flex items-center gap-2.5 px-5 py-4 border-slate-100">
                              <CheckCircleIcon className="text-emerald-600 size-5"/>
                              <h3 className="text-sm text-slate-900 font-bold uppercase tracking-wider">Published Posts</h3>
                              <span className="ml-auto font-bold text-sm bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
                                   {published.length}
                              </span>
                         </div>

                         <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">

                              {published.length === 0 ? (
                                   <div className="py-10 text-center text-slate-400 text-sm">No Posts published yet</div>
                              ) : (
                                   published.map((post)=>(
                                        <div key={post._id} className="py-4 px-5 hover:bg-slate-50/60 transition-colors duration-150 flex gap-4 items-start border-b border-slate-50 last:border-0">
                                             <div className="flex-1 min-w-0 space-y-2">
                                                  <div className="flex items-center justify-between">
                                                       <div className="flex gap-1.5 items-center">
                                                            {(post.platforms || []).map((pl:string)=>{
                                                                 const meta = PLATFORMS.find((p)=>p.id === pl);
                                                                 return meta ? <meta.icon key={pl} className="size-4 text-slate-400" /> : null;
                                                            })}
                                                       </div>
                                                       <span className="text-xs text-slate-400">
                                                            {post.scheduledFor ? new Date(post.scheduledFor).toLocaleString() : ""}
                                                       </span>
                                                  </div>
                                                  
                                                  <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
                                                  
                                                  {post.mediaType && (
                                                       <span className="inline-block text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-xl font-semibold capitalize">
                                                            {post.mediaType}
                                                       </span>
                                                  )}
                                             </div>
                                             
                                             {post.mediaUrl && (
                                                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                                                       {post.mediaType === "video" ? (
                                                            <video src={post.mediaUrl} className="w-full h-full object-cover" />
                                                       ) : (
                                                            <img src={post.mediaUrl} alt="media" className="w-full h-full object-cover" />
                                                       )}
                                                  </div>
                                             )}
                                        </div>
                                   ))
                              )}   
                              
                         </div>
                    </div>
               </div>

          </div>

     </div>
}