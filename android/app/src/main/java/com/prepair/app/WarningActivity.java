package com.prepair.app;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Button;
import android.graphics.Color;
import android.widget.LinearLayout;
import android.view.Gravity;

public class WarningActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setBackgroundColor(Color.parseColor("#0F172A")); // Slate 900
        layout.setPadding(60, 60, 60, 60);

        TextView title = new TextView(this);
        title.setText("App Blocked!");
        title.setTextSize(32);
        title.setTextColor(Color.parseColor("#F43F5E")); // Rose 500
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 0, 0, 40);

        String pkg = getIntent().getStringExtra("package");
        TextView message = new TextView(this);
        message.setText("Strict Mode is active. Focus on your studies!\n\nBlocked: " + (pkg != null ? pkg : "App"));
        message.setTextSize(18);
        message.setTextColor(Color.WHITE);
        message.setGravity(Gravity.CENTER);
        message.setPadding(0, 0, 0, 80);

        Button btn = new Button(this);
        btn.setText("Back to Work");
        btn.setBackgroundColor(Color.parseColor("#22C55E")); // Lime 500
        btn.setTextColor(Color.WHITE);
        btn.setPadding(40, 20, 40, 20);
        btn.setOnClickListener(v -> {
            finish();
        });

        layout.addView(title);
        layout.addView(message);
        layout.addView(btn);

        setContentView(layout);
    }
    
    @Override
    public void onBackPressed() {
        // Do nothing to prevent escaping
    }
}
