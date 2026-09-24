import React, { useState, useEffect } from "react";
import { Shield, Smartphone, Globe, Lock, AlertTriangle } from "lucide-react";

export default function BlocksTab() {
  const [strictMode, setStrictMode] = useState(false);
  const [appLimits, setAppLimits] = useState(true);
  const [webBlocker, setWebBlocker] = useState(false);
  const [shortsBlocker, setShortsBlocker] = useState(true);
  const [uninstallProtect, setUninstallProtect] = useState(false);

  // Load settings on mount
  useEffect(() => {
    setStrictMode(localStorage.getItem('strictMode') === 'true');
    setAppLimits(localStorage.getItem('appLimits') !== 'false');
    setWebBlocker(localStorage.getItem('webBlocker') === 'true');
    setShortsBlocker(localStorage.getItem('shortsBlocker') !== 'false');
    setUninstallProtect(localStorage.getItem('uninstallProtect') === 'true');
  }, []);

  // Handlers to save to localStorage
  const toggleSetting = (key: string, value: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (strictMode && !value) {
      alert("Cannot disable settings while Strict Mode is active!");
      return;
    }
    localStorage.setItem(key, String(value));
    setter(value);
  };

  const handleStrictToggle = () => {
    const newValue = !strictMode;
    if (!newValue) {
      const confirm = window.confirm("Are you sure you want to disable Strict Mode? This defeats the purpose of your focus session.");
      if (!confirm) return;
    }
    localStorage.setItem('strictMode', String(newValue));
    setStrictMode(newValue);
  };

  return (
    <div className="p-6 h-full pb-24">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-[Space Grotesk] text-ink">App & Web Blocks</h2>
        <p className="text-slate text-sm">Control distractions aggressively.</p>
      </div>

      <div className={`${strictMode ? 'bg-forest/10 border-forest/30' : 'bg-rose-bg border-rose/20'} border rounded-2xl p-4 mb-6 flex items-start gap-3 transition-colors`}>
        <Shield className={`${strictMode ? 'text-forest' : 'text-rose'} shrink-0 mt-0.5 transition-colors`} size={20} />
        <div>
          <h4 className={`${strictMode ? 'text-forest' : 'text-rose'} font-bold text-sm mb-1`}>
            Strict Mode is {strictMode ? 'ON' : 'OFF'}
          </h4>
          <p className={`text-xs ${strictMode ? 'text-forest/80' : 'text-rose/80'} leading-relaxed`}>
            When strict mode is on, you cannot uninstall this app, change limits, or bypass blocks until the session ends.
          </p>
          <button 
            onClick={handleStrictToggle}
            className={`mt-3 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm transition-colors ${
              strictMode ? 'bg-forest text-white' : 'bg-white text-rose'
            }`}
          >
            {strictMode ? 'Disable Strict Mode' : 'Enable Strict Mode'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <BlockSetting 
          icon={<Smartphone />}
          title="App Limits"
          description="Set daily time limits for distracting apps like Instagram, YouTube."
          active={appLimits}
          onToggle={() => toggleSetting('appLimits', !appLimits, setAppLimits)}
        />
        <BlockSetting 
          icon={<Globe />}
          title="Website Blocker (VPN)"
          description="Block distracting websites on Chrome and other browsers."
          active={webBlocker}
          pro={true}
          onToggle={() => toggleSetting('webBlocker', !webBlocker, setWebBlocker)}
        />
        <BlockSetting 
          icon={<AlertTriangle />}
          title="Block Shorts & Reels"
          description="Detect and immediately block infinite scrolling feeds."
          active={shortsBlocker}
          pro={true}
          onToggle={() => toggleSetting('shortsBlocker', !shortsBlocker, setShortsBlocker)}
        />
        <BlockSetting 
          icon={<Lock />}
          title="Uninstall Protection"
          description="Prevent deleting this app during active focus blocks."
          active={uninstallProtect}
          pro={true}
          onToggle={() => toggleSetting('uninstallProtect', !uninstallProtect, setUninstallProtect)}
        />
      </div>
    </div>
  );
}

function BlockSetting({ icon, title, description, active, pro = false, onToggle }: { icon: React.ReactNode, title: string, description: string, active: boolean, pro?: boolean, onToggle: () => void }) {
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
          <p className="text-[11px] text-slate mt-0.5 max-w-[190px] leading-tight">{description}</p>
        </div>
      </div>
      
      {/* Toggle Switch */}
      <div onClick={onToggle} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${active ? 'bg-lime' : 'bg-slate-200'}`}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-5' : ''}`}></div>
      </div>
    </div>
  );
}
