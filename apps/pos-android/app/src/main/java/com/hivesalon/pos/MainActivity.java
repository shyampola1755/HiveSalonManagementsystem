package com.hivesalon.pos;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintJob;
import android.print.PrintManager;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.android.material.button.MaterialButton;

public class MainActivity extends AppCompatActivity {

    private static final String DEFAULT_POS_URL = "https://hive-salon-neon.vercel.app/pos-login?mode=pos";
    private static final String USER_AGENT_SUFFIX = " HiveSalonPOS-Android/1.0";

    private WebView webView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private LinearLayout offlineContainer;
    private MaterialButton btnRetry;
    private long backPressedTime = 0;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.posWebView);
        swipeRefresh = findViewById(R.id.swipeRefresh);
        progressBar = findViewById(R.id.progressBar);
        offlineContainer = findViewById(R.id.offlineContainer);
        btnRetry = findViewById(R.id.btnRetry);

        setupSwipeRefresh();
        setupWebView();
        setupBackButtonHandler();

        btnRetry.setOnClickListener(v -> {
            if (isNetworkAvailable()) {
                offlineContainer.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
                webView.reload();
            } else {
                Toast.makeText(this, "No internet connection detected.", Toast.LENGTH_SHORT).show();
            }
        });

        loadInitialUrl();
    }

    private void setupSwipeRefresh() {
        swipeRefresh.setColorSchemeResources(R.color.brand_gold, R.color.brand_dark);
        // Disable touch swipe-to-refresh to prevent accidental page reloads and cart loss during POS billing
        swipeRefresh.setEnabled(false);
        swipeRefresh.setOnRefreshListener(() -> {
            if (isNetworkAvailable()) {
                offlineContainer.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
                webView.reload();
            } else {
                swipeRefresh.setRefreshing(false);
                showOfflineScreen();
            }
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // Append custom POS terminal user-agent
        String defaultUa = settings.getUserAgentString();
        settings.setUserAgentString(defaultUa + USER_AGENT_SUFFIX);

        // Native Receipt Print Bridge interface
        webView.addJavascriptInterface(new POSPrintInterface(this), "AndroidPrintBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                // Inject native print override
                view.evaluateJavascript(
                    "if (!window.__androidPrintInjected) {" +
                    "  window.__androidPrintInjected = true;" +
                    "  var origPrint = window.print;" +
                    "  window.print = function() {" +
                    "    if (window.AndroidPrintBridge) {" +
                    "      window.AndroidPrintBridge.printPage();" +
                    "    } else if (origPrint) {" +
                    "      origPrint();" +
                    "    }" +
                    "  };" +
                    "}", null
                );
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefresh.setRefreshing(false);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    showOfflineScreen();
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }
                return false;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                progressBar.setProgress(newProgress);
                if (newProgress >= 100) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                }
            }
        });
    }

    private void loadInitialUrl() {
        if (!isNetworkAvailable()) {
            showOfflineScreen();
            return;
        }
        offlineContainer.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
        webView.loadUrl(DEFAULT_POS_URL);
    }

    private void showOfflineScreen() {
        webView.setVisibility(View.GONE);
        offlineContainer.setVisibility(View.VISIBLE);
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
        }
        return false;
    }

    private void setupBackButtonHandler() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    if (backPressedTime + 2000 > System.currentTimeMillis()) {
                        finish();
                    } else {
                        Toast.makeText(MainActivity.this, "Press back again to exit Hive POS", Toast.LENGTH_SHORT).show();
                        backPressedTime = System.currentTimeMillis();
                    }
                }
            }
        });
    }

    // JavaScript Bridge for Thermal & Wireless Receipt Printing
    public class POSPrintInterface {
        private final Context context;

        public POSPrintInterface(Context context) {
            this.context = context;
        }

        @JavascriptInterface
        public void printPage() {
            runOnUiThread(() -> {
                try {
                    PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                    if (printManager != null) {
                        PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter("Hive_Salon_Receipt_" + System.currentTimeMillis());
                        PrintAttributes.Builder builder = new PrintAttributes.Builder();
                        builder.setColorMode(PrintAttributes.COLOR_MODE_COLOR);
                        builder.setMediaSize(PrintAttributes.MediaSize.ISO_A5);
                        printManager.print("Hive Salon POS Receipt", printAdapter, builder.build());
                    }
                } catch (Exception e) {
                    Toast.makeText(context, "Printer error: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
    }
}
