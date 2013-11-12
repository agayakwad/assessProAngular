package com.hirepro.assesspro.testserver.business.application.services

import scala.slick.session.Session
import scala.util.Try
import com.diwa.playbase.framework.business.application.services.AppService

trait TestService extends AppService[TestService] {
  def getQuestionPaper(cacheId: Long)(implicit s: Session): Try[String]
  def getQuestionPaperByTest(testId: Long)(implicit s: Session): Try[String]
}
