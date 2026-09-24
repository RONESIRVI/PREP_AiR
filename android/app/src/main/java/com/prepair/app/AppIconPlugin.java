package com.prepair.app;

import android.content.ComponentName;
import android.content.pm.PackageManager;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AppIcon")
public class AppIconPlugin extends Plugin {

    @PluginMethod
    public void changeIcon(PluginCall call) {
        String iconName = call.getString("name");
        if (iconName == null) {
            call.reject("Must provide an icon name");
            return;
        }

        PackageManager pm = getContext().getPackageManager();
        String pkg = getContext().getPackageName();

        ComponentName defaultIcon = new ComponentName(pkg, pkg + ".MainActivityDefault");
        ComponentName goldIcon = new ComponentName(pkg, pkg + ".MainActivityGold");
        ComponentName stealthIcon = new ComponentName(pkg, pkg + ".MainActivityStealth");
        ComponentName gradientIcon = new ComponentName(pkg, pkg + ".MainActivityGradient");
        ComponentName classicIcon = new ComponentName(pkg, pkg + ".MainActivityClassic");
        ComponentName originalIcon = new ComponentName(pkg, pkg + ".MainActivityOriginal");

        try {
            pm.setComponentEnabledSetting(defaultIcon,
                "default".equals(iconName) ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);

            pm.setComponentEnabledSetting(goldIcon,
                "gold".equals(iconName) ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);

            pm.setComponentEnabledSetting(stealthIcon,
                "stealth".equals(iconName) ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);

            pm.setComponentEnabledSetting(gradientIcon,
                "gradient".equals(iconName) ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);

            pm.setComponentEnabledSetting(classicIcon,
                "classic".equals(iconName) ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);

            pm.setComponentEnabledSetting(originalIcon,
                "original".equals(iconName) ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);
                
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not change app icon", e);
        }
    }
}
