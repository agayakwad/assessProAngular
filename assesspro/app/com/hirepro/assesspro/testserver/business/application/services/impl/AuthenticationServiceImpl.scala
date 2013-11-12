package com.hirepro.assesspro.testserver.business.application.services.impl

import com.google.inject._
import scala.slick.session.Session
import com.hirepro.assesspro.testserver.business.application.services.{ TestContext, AuthenticationService }
import com.hirepro.assesspro.common.business.domain.models.AlreadyLoggedInException
import com.hirepro.assesspro.common.business.domain.repositories.UserRepo
import scala.util.Failure
import scala.util.Try

class AuthenticationServiceImpl @Inject() (userRepo: UserRepo) extends AuthenticationService {
  override def authenticate(login: String, password: String, tenantAlias: String)(implicit s: Session): Try[TestContext] = {
    userRepo.authenticate(login, password, tenantAlias) match {
      case None              => Failure(new NoSuchElementException("Login Failed"))
      case Some((u, t, ten)) => postProcessAuthentication(TestContext(u, t, ten))
    }
  }

  private def postProcessAuthentication(testContext: TestContext)(implicit s: Session): Try[TestContext] = {
    val userResult = testContext.user.tryLogin
    userResult transform (
      loggedInUser => {
        val testResult = testContext.test.tryReady
        testResult map { _ => userRepo.save(loggedInUser); testContext.copy(user = loggedInUser) }
      },
      e => {
        e match {
          case ex: AlreadyLoggedInException => userRepo.save(ex.user.passwordDisabledUser)
        }
        Failure(e)
      })
  }
}
