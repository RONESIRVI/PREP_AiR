package com.prepair.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONArray;
import java.util.HashSet;
import java.util.Set;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import java.util.List;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;

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

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        try {
            PackageManager pm = getContext().getPackageManager();
            List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);
            JSArray result = new JSArray();
            
            for (ApplicationInfo app : apps) {
                boolean isSystem = (app.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
                boolean isUpdateToSystem = (app.flags & ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0;
                
                // Exclude core system apps, but keep user apps
                if (!isSystem || isUpdateToSystem || app.packageName.contains("youtube") || app.packageName.contains("chrome")) {
                    JSObject obj = new JSObject();
                    obj.put("packageName", app.packageName);
                    obj.put("appName", pm.getApplicationLabel(app).toString());
                    result.put(obj);
                }
            }
            
            JSObject ret = new JSObject();
            ret.put("apps", result);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to get apps", e);
        }
    }
}
