package com.hirepro.assesspro.testserver.web.play.controllers

import com.google.inject._
import play.api.Play.current
import play.api.db.slick._
import play.api.mvc._
import com.hirepro.assesspro.testserver.web.play.views.html.{ tests => view }
import com.hirepro.assesspro.testserver.business.application.services.TestService
import scala.util.Failure
import scala.util.Success
import scala.util.Try

@Singleton
class Tests @Inject() (testService: TestService) extends Controller {

  def test(candidateId: Long, testId: Long) = Action {
    Ok(view.test(candidateId, testId))
  }

  def questionPaper(id: Long) = DBAction {
    implicit rs =>
      respondWithJson(testService.getQuestionPaper(id))
  }

  def getQuestionPaperByTestAndCandidateId(testId: Long, candidateId: Long) = DBAction {
    implicit rs =>
      respondWithJson(testService.getQuestionPaperByTest(testId))
  }

  private def respondWithJson(maybeJson: Try[String]): SimpleResult = {
    maybeJson match {
      case Failure(ex)   => BadRequest(ex.getMessage())
      case Success(json) => Ok(json)
    }
  }
}
