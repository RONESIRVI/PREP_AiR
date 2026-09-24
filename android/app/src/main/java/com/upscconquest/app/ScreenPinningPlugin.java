package com.upscconquest.app;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "ScreenPinning")
public class ScreenPinningPlugin extends Plugin {

    @PluginMethod
    public void startPinning(PluginCall call) {
        Activity activity = getActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                try {
                    activity.startLockTask();
                    call.resolve();
                } catch (Exception e) {
                    call.reject("Could not start screen pinning", e);
                }
            });
        } else {
            call.reject("Activity is null");
        }
    }

    @PluginMethod
    public void stopPinning(PluginCall call) {
        Activity activity = getActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                try {
                    activity.stopLockTask();
                    call.resolve();
                } catch (Exception e) {
                    call.reject("Could not stop screen pinning", e);
                }
            });
        } else {
            call.reject("Activity is null");
        }
    }
}
