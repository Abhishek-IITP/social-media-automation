import { useEffect, useState } from "react"
import { dummyAccountsData, PLATFORMS } from "../assets/assets";
import { CloudCog, PlusIcon } from "lucide-react";
import { AccountList } from "../components/AccountList";
import { PlatformPicker } from "../components/PlatformPicker";

export function Accounts(){

     const [accounts, setAccounts] = useState<any[]>([]);
     const [connecting, setConnecting] = useState<string | null>(null);
     const [showPlatformPicker, setShowPlatformPicker] = useState<boolean>(false);

     const fetchAccount = async(isSync = false, platform?: string | null, successMsg?: string)=>{

          setAccounts(dummyAccountsData);
          console.log(isSync,platform,successMsg)
     }

     useEffect(()=>{
          fetchAccount()
     },[])

     const handleConnect= async(platformId:string)=>{
          setConnecting(platformId);
          setTimeout(()=>{
               setConnecting(null);
               setAccounts((prev)=>[...prev,dummyAccountsData[0]]);
               setShowPlatformPicker(false);
          },1000)
     }

     const connectedIds = accounts.map((e)=>e.platform)

     return <div className="space-y-8 max-w-5xl">
          <div className=" flex  sm:flex-row items-start sm:items-center justify-between gap-4  text-sm"> 
               <div>
                    <h2 className="text-2xl font-semibold text-slate-800">
                         Connected Accounts
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                         {accounts.length} of {PLATFORMS.length} {accounts.length === 1 ? "platform" : "platform"} connected
                    </p>
</div>
                    <button onClick={()=>setShowPlatformPicker(true)} className="mt-4 flex items-center gap-2 px-5 py-2.5
                    bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center">
                         <PlusIcon className="size-4"/> Connect Accounts
                    </button>

          </div>

          {showPlatformPicker && <PlatformPicker connectedIds={connectedIds} connecting={connecting} onClose={()=>setShowPlatformPicker(false)} onConnect={handleConnect} />}


          <AccountList accounts={accounts} onDisconnect={async(accountId:string)=>{
               setAccounts(accounts.filter((e)=> e._id !== accountId))
               console.log("Disconnecting",accountId)
          }}/>
     </div>
}