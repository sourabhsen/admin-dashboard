package com.aptimus.careers.test;

import java.io.File;
import java.io.FileOutputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.lang.reflect.Method;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.openqa.selenium.Cookie;
import org.testng.ITestContext;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import com.aptimus.test.selenium.BaseBrowser;
import com.aptimus.test.selenium.Logging;

public class DashboardBaseBrowser extends BaseBrowser {
	protected final Charset ISO88591   = Charset.forName ("ISO-8859-1");
    protected final Charset UTF8       = Charset.forName ("UTF-8");
    private final String    cookieFile = "target/" + DashboardEnvironment.id + ".cookie.file";

    static {
        try {
            DashboardEnvironment.initialization ();
        } catch (Exception e) {
            throw new RuntimeException (e.getMessage ());
        }
    }

    @BeforeMethod (alwaysRun = true)
    public void beforeMethod (ITestContext testContext, Method method, Object[] testData) throws Exception {
        try {
            super.beforeMethod (testContext, method, testData);
        } catch (Exception e) {
            // sometimes we're getting:
            // Failed to set the 'cookie' property on 'Document': Cookies are disabled inside
            // 'data:' URLs.
            Logging.error (e.getMessage ());
            super.beforeMethod (testContext, method, testData);
        }

        navigateTo (DashboardEnvironment.dashboard);
    }

    @BeforeClass (alwaysRun = true)
    public void oneTimeLogin (ITestContext testContext) throws Exception {}

    protected void openBrowser (ITestContext testContext, String method) {
        super.openBrowser (testContext, method, "");
        navigateTo (DashboardEnvironment.dashboard);
    }

    @Override
    public String getChromeDriverPath () {
        String driverName = "chromedriver_mac32";
        if (DashboardEnvironment.os.startsWith ("win")) {
            driverName = "chromedriver.exe";
        } else if (DashboardEnvironment.os.contains ("nix") || DashboardEnvironment.os.contains ("nux")) {
            driverName = "chromedriver_linux64";
        }

        File file;
        try {
            file = new File (getClass ().getClassLoader ().getResource (driverName).getFile ());
            if (!DashboardEnvironment.os.startsWith ("win")) {
                Runtime.getRuntime ().exec ("chmod u+x " + file.getPath ());
            }
        } catch (Exception e) {
            throw new RuntimeException (e.getMessage ());
        }

        return file.getPath ();
    }

    @Override
    public String getIeDriverPath () {
        File file;
        try {
            file = new File (getClass ().getClassLoader ().getResource ("IEDriverServer.exe").getFile ());
        } catch (Exception e) {
            throw new RuntimeException (e.getMessage ());
        }

        return file.getPath ();
    }

}
