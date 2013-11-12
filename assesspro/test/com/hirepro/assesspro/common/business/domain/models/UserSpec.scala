package com.hirepro.assesspro.common.business.domain.models

import org.joda.time.DateTime
import com.hirepro.assesspro.common.spec.support.fixtures.UserFactory
import com.diwa.playbase.framework.spec.support.ModelSpec

class UserSpec extends ModelSpec[User] {

  "User" should {

    "not be allowed login when password is disabled" in {
      val user = UserFactory.newUser.copy(isPasswordDisabled = true)
      user.tryLogin must beFailedTry
    }

    "not be allowed login when status is 1" in {
      val user = UserFactory.newUser.copy(status = 1)
      user.tryLogin must beFailedTry
    }

    "not be allowed login when she has already appeared" in {
      val user = UserFactory.newUser.copy(loginTime = Some(DateTime.now()))
      user.tryLogin must beFailedTry
    }

    "be allowed login when password is not disabled" in {
      val user = UserFactory.newUser.copy(isPasswordDisabled = false)
      user.tryLogin must beSuccessfulTry
    }

    "be allowed login when status is 0" in {
      val user = UserFactory.newUser.copy(status = 0)
      user.tryLogin must beSuccessfulTry
    }

    "be allowed login when she has not already appeared" in {
      val user = UserFactory.newUser.copy(loginTime = None)
      user.tryLogin must beSuccessfulTry
    }
  }
}
