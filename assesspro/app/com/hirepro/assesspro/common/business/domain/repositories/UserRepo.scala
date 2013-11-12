package com.hirepro.assesspro.common.business.domain.repositories

import scala.slick.session.Session
import com.hirepro.assesspro.common.business.domain.models.{ User, TestResponseCache, Test, Tenant }
import com.diwa.playbase.framework.business.domain.repositories.Repo

trait UserRepo extends Repo[User] {
  def findByTestAndCandidate(testId: Long, candidateId: Long)(implicit session: Session): Option[User]
  def authenticate(login: String, password: String, alias: String)(implicit session: Session): Option[(User, Test, Tenant)]
  def findWithTestResponses(testId: Long)(implicit s: Session): Seq[(User, TestResponseCache)]
  def findByTest(testId: Long)(implicit session: Session): Seq[User]
}
