import { CheckCircleIcon, ExternalLink, XIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface PlatformPickerProps{
    connectedIds: string[];
    connecting: string | null;
    onClose: ()=> void;
    onConnect: (platformId: string)=> void;
}

export function PlatformPicker({
    connectedIds,
    connecting,
    onClose,
    onConnect
}: PlatformPickerProps){
    return (
        <div className=" fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
                <div className=" flex items-center justify-between px-6 py-4 shadow">
                    <h3 className="text-slate-900 font-semibold text-lg">Chosse a Platform</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                        title="close"
                    >
                        <XIcon className="size-5" />
                    </button>
                    
                </div>

                <div className="p-6 flex flex-col gap-2">
                    {PLATFORMS.map((p)=>{
                        const isConnected = connectedIds.includes(p.id);
                        const isConnecting = connecting === p.id;
                        return(
                            <button
                            key={p.id}
                            disabled={isConnected || isConnecting}
                            onClick={()=>onConnect(p.id)}
                            className={`flex items-center  gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer ${isConnected?"bg-red-50 border border-red-100 text-slate-700" :"border border-slate-100 hover:bg-slate-50"}`}
                            >
                                <p.icon className={`size-6 ${isConnected?"text-red-600":"text-slate-700"}`} />
                                <span className={`font-medium text-sm ${isConnected?"text-red-700":"text-slate-700"}`}>{p.name}</span>

                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm ${isConnected?"text-red-700":"text-slate-700"}`}>
                                        {p.name}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                                        {isConnected?"Already connected":p.description}
                                    </div>

                                </div>

                                {isConnected && <CheckCircleIcon className="size-5 text-red-600" />}
                                {
                                    isConnecting &&(
                                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-slate-300 border-t-slate-600" />
                                    )
                                }
                                {!isConnected && !isConnecting && <ExternalLink className="size-3.5 text-slate-400 shrink-0"/>}
                            </button>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}