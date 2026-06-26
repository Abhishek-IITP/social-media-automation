import { AlertCircleIcon, CheckCircleIcon, PlusIcon, UnplugIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface AccountListProps{
    accounts: any[];
    onDisconnect: (accountId: string)=>Promise<void>;
}

export function AccountList({accounts, onDisconnect}: AccountListProps){

    const handleDisconnect= async(accountId: string)=>{
        try{
            const confirm  = window.confirm("Are you usre you want disconnect this account?")
            if (!confirm) return;
            await onDisconnect(accountId);

            if(accounts.length ===0){
                return (
<div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center py-20 px-6">
  <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
    <PlusIcon className="size-6 text-slate-500 opacity-50" />
  </div>

  <p className="text-slate-700 text-lg">
    No accounts connected
  </p>

  <p className="text-sm text-slate-400 mt-1 max-w-xs text-center">
    Connect your first social platform to start scheduling and automating your content.
  </p>
</div>
                );
            }
        }catch(error){
            console.log("Error disconnecting",error);
        }
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {accounts.map((account)=>{
                const meta = PLATFORMS.find((p)=>p.id === account.platform);
                if(!meta) return null;
                return (
                    <div key={account._id} className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                        
                        {/* Upper Section */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Icon box */}
                                <div className="size-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 p-2 text-slate-600 group-hover:text-slate-900 transition-colors">
                                    <meta.icon className="size-5" />
                                </div>
                                
                                {/* User handle and platform name */}
                                <div className="min-w-0">
                                    <h4 className="text-slate-900 font-semibold text-sm truncate leading-tight">
                                        {account.handle}
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5 leading-none">
                                        {meta.name}
                                    </p>
                                </div>
                            </div>

                            {/* Disconnect action */}
                            <button 
                                onClick={() => handleDisconnect(account._id)} 
                                title="Disconnect account"
                                className="shrink-0 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            >
                                <UnplugIcon className="size-4"/>
                            </button>  
                        </div>

                        {/* Bottom Section - Status Pill */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-1">
                            <span className="text-xs text-slate-400 font-medium">Status</span>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none border ${
                                account.status === "connected" 
                                    ? "bg-emerald-50/50 border-emerald-100 text-emerald-700" 
                                    : "bg-amber-50/50 border-amber-100 text-amber-700"
                            }`}>
                                {account.status === "connected" ? (
                                    <>
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </span>
                                        <span>Connected</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                        </span>
                                        <span>Disconnected</span>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                )
            })}

        </div>
    )
}