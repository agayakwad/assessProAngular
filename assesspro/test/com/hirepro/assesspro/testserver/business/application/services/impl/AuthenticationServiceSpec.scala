package com.hirepro.assesspro.testserver.business.application.services

import play.api.db.slick.DB
import slick.session.Session
import play.api.Play.current
import com.hirepro.assesspro.testserver.business.application.services.impl.AuthenticationServiceImpl
import com.hirepro.assesspro.common.data.slick.repositories.UserRepoImpl
import com.diwa.playbase.framework.spec.support.{WithInMemoryApplication, ServiceSpec}

class AuthenticationServiceSpec extends ServiceSpec[AuthenticationService] {

  "Authentication Service" should {
    "reject wrong tenant" in new WithInMemoryApplication {
      DB.withSession { implicit s: Session =>
        val authService = new AuthenticationServiceImpl(new UserRepoImpl())
        val result = authService.authenticate("third", "third", "t7")
        result must beFailedTry
      }
    }

    "accept valid credentials" in new WithInMemoryApplication {
      DB.withSession { implicit s: Session =>
        val authService = new AuthenticationServiceImpl(new UserRepoImpl())
        val result = authService.authenticate("third", "third", "t2")
        result must beSuccessfulTry
      }
    }

  }

}
