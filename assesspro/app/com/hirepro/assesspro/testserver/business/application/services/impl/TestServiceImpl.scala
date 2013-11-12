package com.hirepro.assesspro.testserver.business.application.services.impl

import com.google.inject._
import scala.slick.session.Session
import com.hirepro.assesspro.testserver.business.application.services.TestService
import com.hirepro.assesspro.common.business.domain.repositories.{ TestRepo, QuestionPaperCacheRepo }
import scala.util.{ Try, Failure, Success }

class TestServiceImpl @Inject() (testRepo: TestRepo, qpcacheRepo: QuestionPaperCacheRepo) extends TestService {
  def getQuestionPaper(cacheId: Long)(implicit s: Session): Try[String] = {
    qpcacheRepo.getOption(cacheId) match {
      case None          => Failure(new RuntimeException(s"Failed to find question paper - $cacheId"))
      case Some(qpCache) => Success(qpCache.questionPaperJson)
    }
  }

  def getQuestionPaperByTest(testId: Long)(implicit s: Session): Try[String] = {
    testRepo.getQuestionPaper(testId) match {
      case None         => Failure(new RuntimeException("Failed to find question paper"))
      case Some(qpJson) => Success(qpJson)
    }
  }
}