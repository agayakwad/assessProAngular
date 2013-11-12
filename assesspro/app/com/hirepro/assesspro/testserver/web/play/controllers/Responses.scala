package com.hirepro.assesspro.testserver.web.play.controllers

import play.api.mvc._
import play.api.db.slick._
import play.api.Play.current
import com.google.inject._
import play.api.libs.json.Json
import com.hirepro.assesspro.testserver.web.play.views.html.{ responses => view }
import com.hirepro.assesspro.testserver.business.application.services.ResponseService
import scala.util.{ Try, Success, Failure }
import play.api.libs.json.JsValue

@Singleton
class Responses @Inject() (responseService: ResponseService) extends Controller {

  //TODO : Replace with BodyParser when play-slick supports
  def submit = DBAction { implicit rs =>
    rs.request.body.asJson.map { json =>
      val result = responseService.submit(json)
      respondWithJson(result)
    }.getOrElse {
      BadRequest("Expecting Json data")
    }
  }

  def submission = Action {
    Ok(view.submit())
  }

  private def respondWithJson(maybeJson: Try[JsValue]): SimpleResult = {
    maybeJson match {
      case Failure(ex)   => BadRequest(ex.getMessage())
      case Success(json) => Ok(json)
    }
  }
}