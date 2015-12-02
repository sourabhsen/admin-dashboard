package com.aptimus.careers.test;

import com.aptimus.test.selenium.Environment;

public class DashboardEnvironment extends Environment {
	public static Boolean isMobile    = false;
    public static Boolean usingSafari = browserType.equals (BrowserType.safari);
    public static Boolean usingIE     = browserType.equals (BrowserType.ie);
    public static String  baseUrl;
    public static String  dashboard;
    public static String  testUser;
    public static String  testPassword;
    public static String  tenant;
    public static String  brand;
    public static String  domain;
    public static Boolean isAnonymous;
    public static Boolean isLoggedin;
    public static Boolean isKnown;

    public static void initialization () {
        baseUrl = (Environment.baseUrl == null ? "https://student.preprod.aptimus.phoenix.edu" : Environment.baseUrl);
        testUser = (Environment.testUser == null ? "cur500s300" : Environment.testUser);
        testPassword = (Environment.testPassword == null ? "Password123" : Environment.testPassword);

        if (browserType.equals (BrowserType.android) ||
            browserType.equals (BrowserType.ipad) ||
            browserType.equals (BrowserType.iphone))
        {
            isMobile = true;
        }

        dashboard = baseUrl;

        String loginStatus = System.getProperty ("login.status", "loggedin");
        isAnonymous = loginStatus.equalsIgnoreCase ("anonymous");
        isLoggedin = loginStatus.equalsIgnoreCase ("loggedin");
        isKnown = loginStatus.equalsIgnoreCase ("known");

        tenant = "uopx";
        brand = "Career Guidance System Analytics Dashboard";
        domain = ".aptimus.net";
    }
}
