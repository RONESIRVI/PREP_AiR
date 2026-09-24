package com.prepair.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONArray;
import java.util.HashSet;
import java.util.Set;

@CapacitorPlugin(name = "AppBlocker")
public class AppBlockerPlugin extends Plugin {

    @PluginMethod
    public void setStrictMode(PluginCall call) {
        boolean enabled = call.getBoolean("enabled", false);
        AppBlockerService.isStrictActive = enabled;
        call.resolve();
    }

    @PluginMethod
    public void setBlockedApps(PluginCall call) {
        try {
            JSONArray apps = call.getArray("packages");
            Set<String> newBlocked = new HashSet<>();
            if (apps != null) {
                for (int i = 0; i < apps.length(); i++) {
                    newBlocked.add(apps.getString(i));
                }
                AppBlockerService.blockedPackages = newBlocked;
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to set blocked apps", e);
        }
    }
}
