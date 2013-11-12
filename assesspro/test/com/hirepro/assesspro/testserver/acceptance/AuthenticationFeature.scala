package com.hirepro.assesspro.testserver.acceptance

import com.diwa.playbase.framework.spec.support.{WithInMemoryBrowser, AcceptanceSpec}

class AuthenticationFeature extends AcceptanceSpec {

  "Application" should {

    "work from within a browser" in new WithInMemoryBrowser {
      browser.goTo("http://localhost:" + port + "/login")
      browser.title must contain("Login")
    }
  }
}
