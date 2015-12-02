package com.aptimus.careers.test;

import static org.testng.Assert.assertTrue;
import org.testng.annotations.Test;

public class DashboardTest extends DashboardBaseBrowser{

	// @Test (groups = {"Acceptance"})
	public void testOpenPage() {
		DashboardPage page = new DashboardPage();
		assertTrue(page.isTextInElement("h1", DashboardEnvironment.brand));
	}

}
