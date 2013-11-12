package com.hirepro.assesspro.testadmin.business.application.services

import scala.slick.session.Session
import java.io.File
import com.hirepro.assesspro.common.business.domain.models.{ User, TestResponseCache, Test, Tenant }
import scala.util.Try
import play.api.libs.json.JsValue
import com.diwa.playbase.framework.business.application.services.AppService

trait ImportExportService extends AppService[ImportExportService] {
  def importTest(file: File)(implicit s: Session): Try[(Tenant, Test, Seq[User])]
  def exportTestToJson(testId: Long)(implicit s: Session): Try[JsValue]
  def enablePassword(candidateId: Long, testId: Long)(implicit s: Session): Try[User]
  def all()(implicit s: Session): (Seq[Tenant], Seq[Test], Seq[User], Seq[TestResponseCache])
}
