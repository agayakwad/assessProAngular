package com.hirepro.assesspro.common.data.slick.tables

import play.api.db.slick.Config.driver.simple._
import com.hirepro.framework.data.slick.tables.RepoTable
import com.hirepro.assesspro.common.business.domain.models.TestResult

class TestResultTable extends RepoTable[TestResult]("test_results") {
  def questionId = column[Long]("question_id", O.DBType("INT(11)"), O.Default(0))
  def answerString = column[Option[String]]("answer_string", O.DBType("varchar(7000)"))
  def isSubjective = column[Int]("is_subjective", O.DBType("tinyint(1)"), O.Default(0))
  def testUserId = column[Option[Long]]("testuser_id", O.DBType("INT(11)"))
  def timeSpent = column[Double]("time_spent", O.Default(0))
  def sectionId = column[Long]("section_id", O.DBType("INT(11)"), O.Default(0))
  def questionTenantId = column[Long]("question_tenant_id", O.DBType("INT(11)"), O.Default(0))
  def testUserIdFk = foreignKey("testuser_id", testUserId, new UserTable)(_.id)

  def * = id.? ~ questionId ~ answerString ~ isSubjective ~ testUserId ~ timeSpent ~ sectionId ~ questionTenantId <> (TestResult.apply _, TestResult.unapply _)
}
