package com.hirepro.assesspro.testserver.web.play.controllers.authentication

import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.db.slick._
import play.api.Play.current
import com.google.inject._
import com.hirepro.assesspro.testserver.business.application.services.{ TestContext, AuthenticationService }
import com.hirepro.assesspro.testserver.web.play.controllers.{ routes => testRoutes }
import com.hirepro.assesspro.testserver.web.play.views.html.authentication.{ sessions => view }
import scala.util.{ Try, Success, Failure }

@Singleton
class Sessions @Inject() (authService: AuthenticationService) extends Controller {

  lazy val loginForm = Form(
    tuple(
      "login" -> nonEmptyText,
      "password" -> nonEmptyText,
      "alias" -> nonEmptyText))

  def login = Action {
    Ok(view.login(loginForm))
  }

  def authenticate = DBAction { implicit rs =>
    loginForm.bindFromRequest fold (
      formWithErrors => BadRequest(view.login(formWithErrors)),
      user => {
        val (login, password, tenantAlias) = user
        val result = authService.authenticate(login, password, tenantAlias)
        respondForUser(user, result)
      })
  }

  //HACK : Keeping in-place in the authenticate function produces a warning
  private def respondForUser(user: (String, String, String), result: Try[TestContext]): SimpleResult = {
    result match {
      case Failure(e) => BadRequest(view.login(loginForm.fill(user).withGlobalError(e.getMessage)))
      case Success(testContext) => Redirect(testRoutes.Tests.test(testContext.user.candidateId, testContext.user.testId.get))
        .withSession("userId" -> testContext.user.id.get.toString(), "testId" -> testContext.test.id.get.toString)
        .withCookies(cookiesForClient(testContext): _*)
    }
  }

  private def cookiesForClient(testContext: TestContext): Seq[Cookie] = {
    val TestContext(user, test, tenant) = testContext

    Seq(
      "ALoginId" -> user.login,
      "TestDuration" -> test.testDuration.toString(),
      "TenantId" -> tenant.id.get.toString(),
      "TenantAlias" -> tenant.alias.toString(),
      "CandidateId" -> user.candidateId.toString(),
      "CandidateName" -> user.candidateName.toString(),
      "ReactivatedCount" -> user.reactivatedCount.toString(),
      "TestId" -> test.id.get.toString(),
      "TestName" -> test.name.get.toString(),
      "TimeSpent" -> user.timeSpent.toString,
      "TypeOfTestType" -> test.typeOfTest.toString())
      .map(item => Cookie(item._1, item._2, httpOnly = false))
  }
}
