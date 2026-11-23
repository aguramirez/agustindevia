package com.agustindev.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.messaging.FirebaseMessaging;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "AgustinDev";
    private static final int PERMISSION_REQUEST_CODE = 101;
    private static final String REGISTER_URL = "https://www.agustindev.com.ar/api/notifications/register";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestNotificationPermissionAndRegister();
    }

    private void requestNotificationPermissionAndRegister() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, PERMISSION_REQUEST_CODE);
            } else {
                fetchAndRegisterFcmToken();
            }
        } else {
            fetchAndRegisterFcmToken();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            fetchAndRegisterFcmToken();
        }
    }

    private void fetchAndRegisterFcmToken() {
        FirebaseMessaging.getInstance().getToken()
            .addOnCompleteListener(task -> {
                if (!task.isSuccessful()) {
                    Log.w(TAG, "Fetching FCM registration token failed", task.getException());
                    return;
                }
                String token = task.getResult();
                Log.i(TAG, "FCM Token obtenido exitosamente: " + token);
                sendTokenToServer(token);
            });
    }

    private void sendTokenToServer(String token) {
        new Thread(() -> {
            try {
                URL url = new URL(REGISTER_URL);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; utf-8");
                conn.setRequestProperty("Accept", "application/json");
                conn.setDoOutput(true);
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);

                String jsonInputString = "{\"token\": \"" + token + "\", \"platform\": \"android\"}";
                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                    os.write(input, 0, input.length);
                }

                int code = conn.getResponseCode();
                Log.i(TAG, "Token enviado al backend. Codigo HTTP: " + code);
                conn.disconnect();
            } catch (Exception e) {
                Log.e(TAG, "Error enviando token al backend: " + e.getMessage());
            }
        }).start();
    }
}
