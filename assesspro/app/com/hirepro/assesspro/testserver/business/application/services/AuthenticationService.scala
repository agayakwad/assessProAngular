package com.hirepro.assesspro.testserver.business.application.services

import scala.slick.session.Session
import com.hirepro.assesspro.common.business.domain.models.{ User, Test, Tenant }
import scala.util.Try
import com.diwa.playbase.framework.business.application.services.AppService

case class TestContext(user: User, test: Test, tenant: Tenant)
trait AuthenticationService extends AppService[AuthenticationService] {
  def authenticate(login: String, password: String, tenantAlias: String)(implicit s: Session): Try[TestContext]
}
