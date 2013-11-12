package com.hirepro.assesspro.common.data.slick.repositories

import org.joda.time.DateTime
import play.api.db.slick.Config.driver.simple._
import com.hirepro.assesspro.common.business.domain.models.{ User, TestResponseCache, Test, Tenant }
import com.hirepro.assesspro.common.business.domain.repositories.UserRepo
import com.hirepro.assesspro.common.data.slick.tables.{ UserTable, TestTable, TestResponseCacheTable, TenantTable }
import com.diwa.playbase.framework.data.slick.repositories.DbRepo

class UserRepoImpl extends DbRepo[User] with UserRepo {
  override val table = new UserTable
  val tenantTable = new TenantTable
  val testTable = new TestTable
  val testResponseCacheTable = new TestResponseCacheTable

  def findByTestAndCandidate(testId: Long, candidateId: Long)(implicit session: Session): Option[User] = {
    val q1 = for (u <- table if u.candidateId === candidateId && u.testId === testId) yield u
    q1.firstOption
  }

  def authenticate(login: String, password: String, alias: String)(implicit session: Session): Option[(User, Test, Tenant)] = {
    val query = for {
      u <- table if u.login === login && u.password === password
      t <- testTable if u.testId === t.id
      ten <- tenantTable if t.tenantId === ten.id && ten.alias === alias
    } yield (u, t, ten)
    query.list.headOption
  }

  def findWithTestResponses(testId: Long)(implicit s: Session): Seq[(User, TestResponseCache)] = {
    val query = for {
      u <- table
      t <- testResponseCacheTable if u.candidateId === t.testUserId && t.testId === testId
    } yield (u, t)
    query.list
  }

  def findByTest(testId: Long)(implicit session: Session): Seq[User] = {
    val q1 = for (u <- table if u.testId === testId) yield u
    q1.list()
  }
}
