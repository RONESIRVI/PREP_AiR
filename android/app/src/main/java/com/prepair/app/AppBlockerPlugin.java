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
import android.graphics.drawable.Drawable;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.util.Base64;
import java.io.ByteArrayOutputStream;
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

    private String drawableToBase64(Drawable drawable) {
        try {
            Bitmap bitmap = Bitmap.createBitmap(drawable.getIntrinsicWidth() > 0 ? drawable.getIntrinsicWidth() : 96,
                                                drawable.getIntrinsicHeight() > 0 ? drawable.getIntrinsicHeight() : 96,
                                                Bitmap.Config.ARGB_8888);
            Canvas canvas = new Canvas(bitmap);
            drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
            drawable.draw(canvas);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
            return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
        } catch (Exception e) {
            return "";
        }
    }

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        try {
            PackageManager pm = getContext().getPackageManager();
            List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);
            JSArray result = new JSArray();
            
            Set<String> basicNeeds = new HashSet<>(Arrays.asList(
                "com.android.settings", "com.android.phone", "com.google.android.dialer",
                "com.android.contacts", "com.google.android.contacts", "com.android.mms",
                "com.google.android.apps.messaging", "com.android.calculator2", "com.google.android.calculator",
                "com.android.camera", "com.android.camera2", "com.google.android.GoogleCamera",
                "com.android.deskclock", "com.google.android.deskclock", "com.android.vending",
                "com.prepair.app" // DO NOT BLOCK PREP AiR
            ));
            
            for (ApplicationInfo app : apps) {
                boolean isSystem = (app.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
                boolean isUpdateToSystem = (app.flags & ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0;
                
                String pkg = app.packageName;
                
                // Exclude basic needs
                if (basicNeeds.contains(pkg)) continue;
                
                // Exclude core system apps, but keep user apps and specific targets
                if (!isSystem || isUpdateToSystem || pkg.contains("youtube") || pkg.contains("chrome") || pkg.contains("instagram")) {
                    
                    // Fallback to -1 if pre-Oreo
                    int category = -1;
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                        category = app.category;
                    }
                    
                    JSObject obj = new JSObject();
                    obj.put("packageName", pkg);
                    obj.put("appName", pm.getApplicationLabel(app).toString());
                    
                    // Map category loosely for React
                    String catName = "Other";
                    if (category == ApplicationInfo.CATEGORY_SOCIAL) catName = "Social";
                    else if (category == ApplicationInfo.CATEGORY_VIDEO) catName = "Video";
                    else if (category == ApplicationInfo.CATEGORY_PRODUCTIVITY) catName = "Productivity";
                    else if (category == ApplicationInfo.CATEGORY_GAME) catName = "Game";
                    else if (pkg.contains("instagram") || pkg.contains("facebook") || pkg.contains("twitter") || pkg.contains("snapchat")) catName = "Social";
                    else if (pkg.contains("youtube") || pkg.contains("netflix") || pkg.contains("tiktok") || pkg.contains("musically")) catName = "Video";
                    else if (pkg.contains("docs") || pkg.contains("drive") || pkg.contains("notes") || pkg.contains("keep")) catName = "Study/Productivity";
                    
                    obj.put("category", catName);
                    
                    try {
                        Drawable icon = pm.getApplicationIcon(app);
                        obj.put("iconBase64", "data:image/png;base64," + drawableToBase64(icon));
                    } catch (Exception e) {
                        obj.put("iconBase64", "");
                    }
                    
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
