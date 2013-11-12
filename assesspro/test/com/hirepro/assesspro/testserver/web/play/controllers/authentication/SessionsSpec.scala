package com.hirepro.assesspro.testserver.web.play.controllers.authentication

import play.api.test._
import play.api.test.Helpers._
import com.hirepro.assesspro.testserver.business.application.services.impl.AuthenticationServiceImpl
import com.hirepro.assesspro.common.data.slick.repositories.UserRepoImpl
import com.hirepro.assesspro.web.play.Global
import com.diwa.playbase.framework.spec.support.{ControllerIntegrationSpec, WithInMemoryApplication}

class SessionsSpec extends ControllerIntegrationSpec[Sessions] {

  "Session" should {
    "accept valid credentials" in new WithInMemoryApplication {
      val controller = Global.getControllerInstance(classOf[Sessions])
      val result = controller.authenticate()(FakeRequest().withFormUrlEncodedBody(("login", "third"), ("password", "third"), ("alias", "t2")))
      status(result) must equalTo(SEE_OTHER)
      val addedCookies = cookies(result)
      addedCookies("ALoginId").value must equalTo("third")
    }

    "reject invalid credentials" in new WithInMemoryApplication {
      val controller = new Sessions(new AuthenticationServiceImpl(new UserRepoImpl()))
      val result = controller.authenticate()(FakeRequest().withFormUrlEncodedBody(("login", "third"), ("password", "wrong"), ("alias", "t2")))
      status(result) must equalTo(BAD_REQUEST)

    }
  }
}