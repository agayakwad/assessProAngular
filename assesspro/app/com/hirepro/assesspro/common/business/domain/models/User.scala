package com.hirepro.assesspro.common.business.domain.models

import org.joda.time.DateTime
import scala.util.{ Success, Failure, Try }
import play.api.libs.json._
import play.api.libs.functional.syntax._
import com.diwa.playbase.framework.business.domain.models.Model

class AlreadyLoggedInException(val user: User) extends RuntimeException

case class User(id: Option[Long],
  login: String,
  password: String,
  testId: Option[Long] = None,
  candidateId: Long = 0,
  timeSpent: Double = 0,
  timeStamp: Option[DateTime] = None,
  loginTime: Option[DateTime] = None,
  logOutTime: Option[DateTime] = None,
  status: Int = 0,
  isPasswordDisabled: Boolean = false,
  clientSystemInfo: String = "",
  candidateName: Option[String] = None,
  candidateEmail: Option[String] = None,
  reactivatedCount: Int = 0)
  extends Model[User] {

  def withId(id: Long): User = copy(id = Some(id))

  def submittedUser(newTimeStamp: DateTime, newTimeSpent: Double, isPartialSubmission: Boolean): User = {
    val result = copy(timeStamp = Some(newTimeStamp), timeSpent = newTimeSpent)
    if (isPartialSubmission) result else result.copy(logOutTime = Option(DateTime.now), status = 1)
  }

  def passwordDisabledUser: User = copy(isPasswordDisabled = true)
  def passwordEnabledUser: User = copy(loginTime = None, isPasswordDisabled = false)

  def tryLogin: Try[User] = {
    passwordIsDisabled
      .flatMap(_.alreadyAttended
        .flatMap(_.alreadyLoggedIn
          .flatMap(user => Success(user.copy(loginTime = Some(DateTime.now()))))))
  }

  //TODO : Rewrite with flatmap
  def hasFinishedTest: Boolean = !logOutTime.isDefined && loginTime.isDefined

  private def passwordIsDisabled: Try[User] = {
    if (isPasswordDisabled)
      Failure(new UnsupportedOperationException("Your session has been expired. Contact Admin"))
    else
      Success(this)
  }

  private def alreadyAttended: Try[User] = {
    if (status != 0)
      Failure(new UnsupportedOperationException("You have already appeared in the test"))
    else
      Success(this)
  }
  private def alreadyLoggedIn: Try[User] = {
    if (loginTime.isDefined)
      Failure(new AlreadyLoggedInException(this))
    else
      Success(this)
  }
}

object User {
  implicit val userReads: Reads[User] = (
    (__ \ "LoginId").read[String] and
    (__ \ "Password").read[String] and
    (__ \ "TestTypeId").read[Long] and
    (__ \ "CandidateId").read[Long] and
    (__ \ "IsPasswordDisabled").read[Boolean] and
    (__ \ "CandidateName").read[String] and
    (__ \ "EMail").read[String])(User.importedUser _)

  def importedUser(login: String, password: String, testId: Long, candidateId: Long, isPasswordDisabled: Boolean,
    name: String, email: String): User = {
    User(None, login, password, Some(testId), candidateId, isPasswordDisabled = isPasswordDisabled,
      candidateName = Some(name), candidateEmail = Some(email))
  }

  implicit val userWrites: Writes[User] = (
    (__ \ "LoginId").write[String] and
    (__ \ "Password").write[String] and
    (__ \ "TestTypeId").write[Option[Long]] and
    (__ \ "CandidateId").write[Long] and
    (__ \ "IsPasswordDisabled").write[Boolean] and
    (__ \ "CandidateName").write[Option[String]] and
    (__ \ "EMail").write[Option[String]] and
    (__ \ "LogOutTime").write[Option[DateTime]])(unlift(User.exportUser _))

  def exportUser(user: User): Option[(String, String, Option[Long], Long, Boolean, Option[String], Option[String],Option[DateTime] )] = {
    Some((user.login, user.password, user.testId, user.candidateId, user.isPasswordDisabled, user.candidateName, user.candidateEmail, user.logOutTime))

  }

}
