package com.hirepro.assesspro.testadmin.business.application.services.impl

import java.io.{ FileOutputStream, File }
import com.google.inject._
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import play.api.db.slick._
import scala.collection.mutable
import com.hirepro.assesspro.testadmin.business.application.services.ImportExportService
import com.hirepro.assesspro.common.business.domain.repositories._
import play.api.libs.json._
import com.hirepro.assesspro.common.business.domain.models.{ Test, TestResponseCache, User, Tenant, QuestionPaperCache }
import scala.util.{ Success, Failure, Try }
import com.diwa.playbase.framework.infrastructure.util.ZipArchive

class ImportExportServiceImpl @Inject() (tenantRepo: TenantRepo, testRepo: TestRepo, userRepo: UserRepo, qpCacheRepo: QuestionPaperCacheRepo, testResponseCacheRepo: TestResponseCacheRepo)
    extends ImportExportService {

  def importTest(file: File)(implicit session: Session): Try[(Tenant, Test, Seq[User])] = {

    val unArchiver = new ZipArchive(file)
    val jsonMap = unArchiver.unZip

    val tenantJson = Json parse jsonMap("TenantInfo.json")
    val tenant = (tenantJson \ "Tenant").as[Tenant]

    val testJson = jsonMap("TestInfo.json")
    val test = readTest(testJson)

    val userJson = Json parse jsonMap("TestUserInfo.json")
    val users = (userJson \ "TestLoginInfoTypes").as[Seq[User]]

    val qpJson = jsonMap("QuestionPaperInfo.json")
    //TODO : process images
    val qp = QuestionPaperCache(None, tenant.id.get, test.questionPaperId, qpJson)

    session.withTransaction {
      tenantRepo.insert(tenant)
      testRepo.insert(test)
      userRepo.insertAll(users: _*)
      qpCacheRepo.insert(qp)
    }

    Success((tenant, test, users))
  }

  def exportTestToJson(testId: Long)(implicit s: Session): Try[JsValue] = {
    val test = testRepo.get(testId)
    val tenantId = test.tenantId
    val (users, testResponses) = userRepo.findWithTestResponses(testId.toLong).unzip
    val answers = testResponses.foldLeft(mutable.Map[(Long, Long), String]().withDefaultValue("")) {
      (testMap, response) => testMap((response.testId, response.testUserId)) += response.testResponseJson; testMap
    }
    val json = Json.obj(
      "TenantId" -> tenantId,
      "Tests" -> responseMaptoJson(answers, users)
    )
    Success(json)
  }

  def enablePassword(candidateId: Long, testId: Long)(implicit s: Session): Try[User] = {
    val maybeUser = userRepo.findByTestAndCandidate(testId, candidateId)
    maybeUser match {
      case None       => Failure(new NoSuchElementException("No user found for Candidate : " + candidateId + ", Test : " + testId))
      case Some(user) => userRepo.save(user.passwordEnabledUser); Success(user)
    }
  }

  def all()(implicit s: Session): (Seq[Tenant], Seq[Test], Seq[User], Seq[TestResponseCache]) = {
    (tenantRepo.all, testRepo.all, userRepo.all, testResponseCacheRepo.all)
  }

  private def readTest(testJson: String): Test = {

    val t = (Json.parse(testJson) \ "JsonTest")

    val isInstantResult = (t \ "IsInstantResult").as[Boolean]

    val tenantId = (t \ "QuestionPaperTenantId").as[Long] //To be replaced with TenantId
    val testId = (t \ "ObjectId").as[Long]
    val questionPaperId = (t \ "QuestionPaperId").as[Long]
    val testDuration = (t \ "TestDuration").as[Double]
    val testName = (t \ "Name").as[String]

    val permissibleLateTime = (t \ "PermissibleLateTime").as[Int]
    var testStartTime: DateTime = null //t.get("TestStartTime").toString()
    var testEndTime: DateTime = null //t.get("TestEndTime").toString()

    val isAlltimePermissible = (t \ "IsAllTimePermissible").as[Boolean]
    val instructions = (t \ "Instructions").toString()
    val isGroupWiseTiming = (t \ "IsGroupWiseTiming").as[Boolean]
    val isOptonRandomize = (t \ "IsOptionRandomize").as[Boolean]
    val typeOfTest = (t \ "TypeOfTestType").as[Int]

    val config = (t \ "Config").as[Option[String]]
    val isTestActive = (t \ "IsTestActive").as[Boolean]
    val noOfCandidates = (t \ "NoOfCandidates").as[Long]
    val isInstantEvaluation = (t \ "IsInstantEvaluationRequired").as[Boolean]
    val questionpaperTenantId = (t \ "QuestionPaperTenantId").as[Int]
    val isQuestionRandomizing = (t \ "IsQuestionRandomising").as[Boolean]

    val validFromString = (t \ "ValidFrom").as[String]
    val validFrom = extractDate(validFromString)

    val validToString = (t \ "ValidTo").as[String]
    val validTo = extractDate(validToString)

    var startTimeString: Any = t \ "TestStartTime"
    testStartTime = validFrom
    if (startTimeString.toString != "null" && startTimeString.toString.length > 0) {
      val hours = startTimeString.toString.substring(1, startTimeString.toString.indexOf(":"))
      startTimeString = startTimeString.toString.substring(startTimeString.toString.indexOf(":") + 1, startTimeString.toString.length)
      val minutes = startTimeString.toString.substring(0, startTimeString.toString.indexOf(":"))
      startTimeString = startTimeString.toString.substring(startTimeString.toString.indexOf(":") + 1, startTimeString.toString.length)
      val seconds = startTimeString.toString.substring(0, startTimeString.toString.length - 1)
      testStartTime.plusHours(Integer.parseInt(hours))
      testStartTime.plusMinutes(Integer.parseInt(minutes))
      testStartTime.plusSeconds(Integer.parseInt(seconds))
    }

    var endTimeString: Any = t \ "TestEndTime"
    testEndTime = validTo
    if (endTimeString.toString != "null" && endTimeString.toString.length > 0) {
      val hours = endTimeString.toString.substring(1, endTimeString.toString.indexOf(":"))
      endTimeString = endTimeString.toString.substring(endTimeString.toString.indexOf(":") + 1, endTimeString.toString.length)
      val minutes = endTimeString.toString.substring(0, endTimeString.toString.indexOf(":"))
      endTimeString = endTimeString.toString.substring(endTimeString.toString.indexOf(":") + 1, endTimeString.toString.length)
      val seconds = endTimeString.toString.substring(0, endTimeString.toString.length - 1)
      testEndTime.plusHours(Integer.parseInt(hours))
      testEndTime.plusMinutes(Integer.parseInt(minutes))
      testEndTime.plusSeconds(Integer.parseInt(seconds))
    }

    Test(Option(testId), tenantId, questionPaperId, testDuration, Option(testName), Option(validFrom), Option(validTo), permissibleLateTime, Option(testStartTime), Option(testEndTime), isAlltimePermissible, Option(instructions), isGroupWiseTiming, isOptonRandomize, typeOfTest, config, isTestActive, isInstantResult, noOfCandidates, isInstantEvaluation, questionpaperTenantId, isQuestionRandomizing)
  }

  private def extractDate(dateTimeString: String): DateTime = {

    val formatter = DateTimeFormat.forPattern("M/d/y H:m:s");
    if (dateTimeString != "null" && dateTimeString.length > 0) {
      val dtValidFrom = formatter.parseDateTime(dateTimeString + " 00:00:00");
      dtValidFrom
    } else
      DateTime.parse("01/01/1001" + " 00:00:00")
  }

  private def getUserInfo(users: Seq[User], testUserId: Long, testResponse: String)(implicit s: Session): JsObject = {
    val jsObject = users.foldLeft(Json.obj()) {
      (json, objct) =>
        val t = if (objct.candidateId == testUserId) {
          Json.obj(
            "TestUserId" -> objct.candidateId.toString,
            "IsPasswordDisabled" -> objct.isPasswordDisabled,
            "LoginTime" -> objct.loginTime,
            "LogOutTime" -> objct.logOutTime,
            "ReactivatedCount" -> objct.reactivatedCount,
            "Status" -> objct.status,
            "TimeStamp" -> objct.timeStamp,
            "TotalTimeSpent" -> objct.timeSpent,
            "Answers" -> Json.parse(testResponse))
        } else {
          Json.obj()
        }
        json ++ t
    }
    jsObject
  }

  private def responseMaptoJson(answers: mutable.Map[(Long, Long), String], users: Seq[User])(implicit s: Session): JsArray = {
    answers.foldLeft(JsArray()) {
      (responseArray, response) =>
        responseArray :+
          {
            val ((testId, testUserId), testResponseJson) = response
            Json.obj(
              "Candidates" -> Json.arr(
                getUserInfo(users, testUserId, testResponseJson)))
          }
    }
  }
}
