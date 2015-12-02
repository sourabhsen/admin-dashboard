package com.aptimus.careers.test;

import static org.openqa.selenium.support.ui.ExpectedConditions.frameToBeAvailableAndSwitchToIt;
import static org.openqa.selenium.support.ui.ExpectedConditions.invisibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.textToBePresentInElement;
import java.util.ArrayList;
import java.util.List;
import org.apache.http.cookie.Cookie;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.Point;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.aptimus.test.selenium.BasePage;
import com.aptimus.test.selenium.Logging;

public class DashboardPage extends BasePage {
	// Element is not always visible until you scroll down (ie. flyover).
    // Split isTextInElement() into 2.
    protected boolean isTextInElement (String css, String text) {
        waitForjQueryDone ();
        return isTextInElement (scrollTo (waitForElement (css)), text);
    }

    protected boolean isTextInElement (WebElement el, String text) {
        try {
            return new WebDriverWait (getDriver (), DashboardEnvironment.maxWaitTime).until (
                    textToBePresentInElement (el, text));
        } catch (TimeoutException e) {
            Logging.error ("found text=" + el.getText ());
            return false;
        }
    }

    protected boolean noSuchElementPresent (String css) {
        try {
            waitForjQueryDone ();
            if (new WebDriverWait (getDriver (), DashboardEnvironment.maxWaitTime).until (
                    invisibilityOfElementLocated (By.cssSelector (css))))
                return !isElementPresent (css);
            else
                return false;
        } catch (TimeoutException e) {
            Logging.error (e.getMessage ());
            return false;
        }
    }

    protected boolean isElementHidden (String css) {
        try {
            waitForjQueryDone ();
            if (new WebDriverWait (getDriver (), DashboardEnvironment.maxWaitTime).until (
                    invisibilityOfElementLocated (By.cssSelector (css))))
                return isElementPresent (css);
            else
                return false;
        } catch (TimeoutException e) {
            Logging.error (e.getMessage ());
            return false;
        }
    }

    protected boolean isElementPresent (WebElement el, String css) {
        try {
            waitForjQueryDone ();
            el.findElement (By.cssSelector (css));
            return true;
        } catch (NoSuchElementException e) {
            Logging.info ("css is not present=" + css);
            return false;
        }
    }

    public boolean isElementVisible (String css) {
        boolean status = super.isElementVisible (css);
        if (!status)
            Logging.info ("css is not visible=" + css);
        return status;
    }

    public WebDriver waitForFrame (WebDriver driver, String css) {
        waitForjQueryDone ();
        return new WebDriverWait (driver, DashboardEnvironment.maxWaitTime).until (
                frameToBeAvailableAndSwitchToIt (By.cssSelector (css)));
    }

    protected String getText (WebElement el, String css) {
        waitForjQueryDone ();
        return el.findElement (By.cssSelector (css)).getText ().trim ();
    }

    protected String getAttribute (WebElement el, String css, String attribute) {
        waitForjQueryDone ();
        return el.findElement (By.cssSelector (css)).getAttribute (attribute);
    }

    protected boolean clickAndSelectValue (String select, String value) {
        try {
            new Select (scrollTo (waitForElementClickable (select))).selectByValue (value);
            return click (select + " > option[value='" + value + "']");
        } catch (Exception e) {
            Logging.error (e.getMessage ());
            return false;
        }
    }

    protected boolean clickAndSelectText (String select, String text) {
        try {
            if (!text.equals ("")) {
                new Select (scrollTo (waitForElementClickable (select))).selectByVisibleText (text);
            }
            return true;
        } catch (Exception e) {
            Logging.error (e.getMessage ());
            return false;
        }
    }

    @Override
    public WebElement scrollTo (WebElement el) {
        Point location = el.getLocation ();
        Dimension size = el.getSize ();
        int redStaticBarHeight = 200;
        int x = location.getX () - (size.getWidth () / 2);
        int y = location.getY () - (size.getHeight () / 2);
        executeJavascript (String.format ("window.scroll(%s, %s)",
                                          x < 0 ? 0 : 0,
                                          y < redStaticBarHeight ? redStaticBarHeight : y - redStaticBarHeight));
        return el;
    }

    @Override
    public void hover (String cssSelector) {
        if (DashboardEnvironment.isMobile || DashboardEnvironment.usingSafari || DashboardEnvironment.usingIE) {
            scrollTo (waitForElement (cssSelector));
            executeJavascript ("$( '" + cssSelector.replace ("'", "\\'") + "').mouseover();");
        } else {
            hover (By.cssSelector (cssSelector));
        }
    }

    protected boolean pressKey (Keys key) {
        Actions actions = new Actions (getDriver ());
        try {
            waitForjQueryDone ();
            actions.sendKeys (key).perform ();
            return waitForjQueryDone ();
        } catch (Exception e) {
            Logging.error (e.getMessage ());
            return false;
        }
    }

    public boolean hasPageLoaded () {
        long timeOut = System.currentTimeMillis () + (DashboardEnvironment.maxWaitTime * 1000);
        boolean result;
        do {
            result = String.valueOf (executeJavascript ("return document.readyState")).equals ("complete");
            if (result) {
                return result;
            } else {
                wait (250);
            }
        } while (System.currentTimeMillis () < timeOut);
        Logging.error ("page failed to load");
        return result;
    }

    protected String checkSessionStorage (String jsScript) {
        long timeOut = System.currentTimeMillis () + (DashboardEnvironment.maxWaitTime * 1000);
        String result;
        do {
            result = executeJavascript (jsScript);
            if (result.isEmpty ()) {
                wait (250);
            } else {
                return result;
            }
        } while (System.currentTimeMillis () < timeOut);
        Logging.error (jsScript + " is failed");
        return result;
    }

    protected String executeJavascript (String javascript, WebElement el) {
        String output = "";
        try {
            output = String.valueOf ( ((JavascriptExecutor) getDriver ()).executeScript (javascript, el));
        } catch (Exception e) {
            Logging.error (e.getMessage ());
        }
        return output;
    }

    @Override
    public void navigateRefresh () {
        getDriver ().navigate ().refresh ();
        hasPageLoaded ();
        waitForjQueryDone ();
    }

    @Override
    public void navigateTo (String url) {
        getDriver ().navigate ().to (url);
        hasPageLoaded ();
        waitForjQueryDone ();
    }

    @Override
    public void navigateBack () {
        getDriver ().navigate ().back ();
        hasPageLoaded ();
        waitForjQueryDone ();
    }


}
