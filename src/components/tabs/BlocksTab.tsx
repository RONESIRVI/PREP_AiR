import React from "react";
import { Shield, Smartphone, Globe, Lock, AlertTriangle } from "lucide-react";

export default function BlocksTab() {
  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-[Space Grotesk] text-ink">App & Web Blocks</h2>
        <p className="text-slate text-sm">Control distractions aggressively.</p>
      </div>

      <div className="bg-rose-bg border border-rose/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Shield className="text-rose shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-rose font-bold text-sm mb-1">Strict Mode is OFF</h4>
          <p className="text-xs text-rose/80 leading-relaxed">
            When strict mode is on, you cannot uninstall this app, change limits, or bypass blocks until the session ends.
          </p>
          <button className="mt-3 text-xs font-bold bg-white text-rose px-4 py-1.5 rounded-full shadow-sm">Enable Strict Mode</button>
        </div>
      </div>

      <div className="space-y-4">
        <BlockSetting 
          icon={<Smartphone />}
          title="App Limits"
          description="Set daily time limits for distracting apps like Instagram, YouTube."
          active={true}
        />
        <BlockSetting 
          icon={<Globe />}
          title="Website Blocker (VPN)"
          description="Block distracting websites on Chrome and other browsers."
          active={false}
          pro={true}
        />
        <BlockSetting 
          icon={<AlertTriangle />}
          title="Block Shorts & Reels"
          description="Detect and immediately block infinite scrolling feeds."
          active={true}
          pro={true}
        />
        <BlockSetting 
          icon={<Lock />}
          title="Uninstall Protection"
          description="Prevent deleting this app during active focus blocks."
          active={false}
          pro={true}
        />
      </div>
    </div>
  );
}

function BlockSetting({ icon, title, description, active, pro = false }: { icon: React.ReactNode, title: string, description: string, active: boolean, pro?: boolean }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-forest/10 text-forest' : 'bg-slate-50 text-slate'}`}>
          {React.cloneElement(icon as React.ReactElement, { size: 18 })}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-ink text-sm">{title}</h4>
            {pro && <span className="bg-amber-bg text-amber text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Pro</span>}
          </div>
          <p className="text-[11px] text-slate mt-0.5 max-w-[200px]">{description}</p>
        </div>
      </div>
      
      {/* Toggle Switch */}
      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-lime' : 'bg-slate-200'}`}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-5' : ''}`}></div>
      </div>
    </div>
  );
}
