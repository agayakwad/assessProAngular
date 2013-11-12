package com.hirepro.assesspro.common.data.slick.tables

import play.api.db.slick.Config.driver.simple._
import org.joda.time.DateTime
import com.diwa.playbase.framework.data.slick.types.mappers.DateTimeMapper
import DateTimeMapper._
import com.hirepro.framework.data.slick.tables.RepoTable
import com.hirepro.assesspro.common.business.domain.models.Test
import com.diwa.playbase.framework.data.slick.types.mappers.DateTimeMapper

class TestTable extends RepoTable[Test]("tests") {
  def tenantId = column[Long]("tenant_id", O.DBType("INT(11)"))
  def questionPaperId = column[Long]("question_paper_id", O.DBType("INT(11)"), O.Default(0))
  def testDuration = column[Double]("test_duration", O.Default(0))
  def name = column[Option[String]]("name")
  def validFrom = column[Option[DateTime]]("valid_from", O.DBType("DATETIME"))
  def validTo = column[Option[DateTime]]("valid_to", O.DBType("DATETIME"))
  def permissibleLateTime = column[Int]("permissible_late_time", O.DBType("INT(11)"), O.Default(0))
  def testStartTime = column[Option[DateTime]]("test_start_time", O.DBType("DATETIME"))
  def testEndTime = column[Option[DateTime]]("test_end_time", O.DBType("DATETIME"))
  def isAllTimePermissible = column[Boolean]("is_all_time_permissible", O.DBType("tinyint(1)"), O.Default(false))
  def instructions = column[Option[String]]("instructions", O.DBType("Text"))
  def hasGroupWiseTiming = column[Boolean]("group_wise_timing", O.DBType("tinyint(1)"), O.Default(false))
  def isOptionRandomize = column[Boolean]("is_option_randomize", O.DBType("tinyint(1)"), O.Default(false))
  def typeOfTest = column[Int]("type_of_test", O.DBType("INT(11)"), O.Default(0))
  def config = column[Option[String]]("config", O.DBType("varchar(2000)"))
  def isTestActive = column[Boolean]("is_test_active", O.DBType("tinyint(1)"), O.Default(false))
  def isInstantResult = column[Boolean]("is_instant_result", O.DBType("tinyint(1)"), O.Default(false))
  def noOfCandidates = column[Long]("no_of_candidates", O.DBType("INT(11)"), O.Default(0))
  def instantEvaluation = column[Boolean]("instant_evaluation", O.DBType("tinyint(1)"), O.Default(false))
  def questionPaperTenantId = column[Int]("que_paper_tenantid", O.DBType("INT(11)"), O.Default(0))
  def questionRandomizing = column[Boolean]("question_randomizing", O.DBType("tinyint(1)"), O.Default(false))

  def * = id.? ~ tenantId ~ questionPaperId ~ testDuration ~ name ~ validFrom ~ validTo ~ permissibleLateTime ~ testStartTime ~ testEndTime ~ isAllTimePermissible ~ instructions ~ hasGroupWiseTiming ~ isOptionRandomize ~ typeOfTest ~ config ~ isTestActive ~ isInstantResult ~ noOfCandidates ~ instantEvaluation ~ questionPaperTenantId ~ questionRandomizing <> (Test.apply _, Test.unapply _)
}
