package com.hirepro.assesspro.common.data.slick.tables

import play.api.db.slick.Config.driver.simple._
import org.joda.time.DateTime
import com.diwa.playbase.framework.data.slick.types.mappers.DateTimeMapper
import DateTimeMapper._
import com.hirepro.framework.data.slick.tables.RepoTable
import com.hirepro.assesspro.common.business.domain.models.User
import com.diwa.playbase.framework.data.slick.types.mappers.DateTimeMapper

class UserTable extends RepoTable[User]("test_users") {
  def candidateId = column[Long]("candidate_id", O.DBType("INT(11)"), O.Default(0))
  def loginTime = column[Option[DateTime]]("login_time", O.DBType("DATETIME"))
  def logOutTime = column[Option[DateTime]]("log_out_time", O.DBType("DATETIME"))
  def status = column[Int]("status", O.Default(0))
  def isPasswordDisabled = column[Boolean]("is_password_disabled", O.DBType("Boolean"), O.Default(false))
  def clientSystemInfo = column[String]("client_system_info", O.Default(""))
  def candidateName = column[String]("candidate_name")
  def candidateEmail = column[String]("candidate_email")
  def reactivatedCount = column[Int]("reactivated_count", O.Default(0))
  def timeSpent = column[Double]("time_spent", O.Default(0))
  def login = column[String]("login_id")
  def password = column[String]("password")
  def testId = column[Option[Long]]("test_id", O.DBType("INT(11)"))
  def timeStamp = column[Option[DateTime]]("time_stamp", O.DBType("DATETIME"))
  def testIdFk = foreignKey("test_id", testId, new TestTable)(_.id)

  def * = id.? ~ login ~ password ~ testId ~ candidateId ~ timeSpent ~ timeStamp ~ loginTime ~ logOutTime ~ status ~ isPasswordDisabled ~ clientSystemInfo ~ candidateName.? ~ candidateEmail.? ~ reactivatedCount <> (User.apply _, User.unapply _)
}
