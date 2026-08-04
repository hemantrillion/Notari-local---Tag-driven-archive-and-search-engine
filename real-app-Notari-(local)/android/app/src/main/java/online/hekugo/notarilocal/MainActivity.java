package online.hekugo.notarilocal;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleSendIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleSendIntent(intent);
    }

    private void handleSendIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (sharedText == null) {
                sharedText = intent.getStringExtra(Intent.EXTRA_SUBJECT);
            }
            if (sharedText != null && !sharedText.trim().isEmpty()) {
                final String cleanUrl = sharedText.trim();
                if (this.bridge != null && this.bridge.getWebView() != null) {
                    this.bridge.getWebView().post(new Runnable() {
                        @Override
                        public void run() {
                            bridge.getWebView().evaluateJavascript(
                                "if(window.handleAndroidIncomingShare){ window.handleAndroidIncomingShare('" + cleanUrl.replace("'", "\\'").replace("\n", " ") + "'); }",
                                null
                            );
                        }
                    });
                }
            }
        }
    }
}
