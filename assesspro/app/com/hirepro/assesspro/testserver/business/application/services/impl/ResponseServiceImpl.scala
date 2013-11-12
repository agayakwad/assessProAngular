package com.hirepro.assesspro.testserver.business.application.services.impl

import scala.slick.session.Session
import com.google.inject._
import play.api.libs.json.JsValue
import org.joda.time.format.DateTimeFormat
import play.api.libs.json.Json
import com.hirepro.assesspro.testserver.business.application.services.ResponseService
import com.hirepro.assesspro.common.business.domain.repositories.{ UserRepo, TestResponseCacheRepo }
import scala.util.Try
import scala.util.Failure
import scala.util.Success

class ResponseServiceImpl @Inject() (responseCacheRepo: TestResponseCacheRepo, userRepo: UserRepo) extends ResponseService {

  val successJson = Json.obj(
    "CreatedObjectId" -> 0,
    "IsException" -> false,
    "IsFailure" -> false,
    "Message" -> "Results Submitted Successfully")

  def submit(response: JsValue)(implicit s: Session): Try[JsValue] = {

    val testId = (response \ "TestId").as[String]
    val timeStamp = (response \ "TimeStamp").as[String]
    val tenantId = (response \ "TenantId").as[String]
    val testUserId = (response \ "TestUserId").as[String]
    val partialSubmission = (response \ "IsPartialSubmission").as[Boolean]
    val timeSpent = response \ "TotalTimeSpent"
    val formatter = DateTimeFormat.forPattern("M/d/y H:m:s");
    val dtTimeStamp = formatter.parseDateTime(timeStamp);
    val answers = Json.stringify(response \ "Answers")

    userRepo.findByTestAndCandidate(testId.toLong, testUserId.toLong) match {
      case None => Failure(new NoSuchElementException(s"Failed to submit response for test : $testId and user : $testUserId"))
      case Some(user) => {
        val submittedUser = user.submittedUser(dtTimeStamp, if (timeSpent.toString() == "null") 0D else timeSpent.toString().toDouble, partialSubmission)
        userRepo.save(submittedUser)
        responseCacheRepo.upsert(tenantId.toLong, testUserId.toLong, testId.toLong, partialSubmission, answers)
        Success(successJson)
      }
    }
  }
}