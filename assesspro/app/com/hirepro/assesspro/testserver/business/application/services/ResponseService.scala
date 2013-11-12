package com.hirepro.assesspro.testserver.business.application.services

import scala.slick.session.Session
import play.api.libs.json.JsValue
import scala.util.Try
import com.diwa.playbase.framework.business.application.services.AppService

trait ResponseService extends AppService[ResponseService] {
  def submit(response: JsValue)(implicit s: Session): Try[JsValue]
}
