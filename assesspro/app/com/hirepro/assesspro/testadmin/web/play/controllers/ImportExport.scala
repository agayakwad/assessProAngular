package com.hirepro.assesspro.testadmin.web.play.controllers

import play.api.Play.current
import play.api.db.slick._
import play.api.mvc.Action
import play.api.mvc.Controller
import java.io._
import com.google.inject._
import com.hirepro.assesspro.testadmin.business.application.services.ImportExportService
import scala.util.{ Success, Failure }

@Singleton
class ImportExport @Inject() (importExportService: ImportExportService) extends Controller {

  def importData = Action(parse.multipartFormData) { request =>
    request.body.file("package").map { packageFile =>
      val tempFile: File = File.createTempFile("assesspro", "zip")
      packageFile.ref.moveTo(tempFile, replace = true)
      DB.withSession { implicit s: Session =>
        val result = importExportService.importTest(tempFile)
        tempFile.delete()
        result match {
          case Failure(e) => BadRequest(e.getMessage)
          case Success((tenant, test, users)) => {
            val message = "Successfully Imported! Tenant: " + tenant.tenantName + ", Test: " + test.name.get + ", " + users.size + " users"
            Redirect(routes.Admin.index()).flashing("success" -> message)
          }
        }
      }
    }.getOrElse {
      Redirect(routes.Admin.index()).flashing("error" -> "Missing file")
    }
  }

  def exportTestData(testId: Long) = DBAction { implicit rs =>
    val result = importExportService.exportTestToJson(testId)
    result match {
      case Failure(ex)   => BadRequest(ex.getMessage)
      case Success(json) => Ok(json)
    }
  }

  def enablePassword(candidateId: Long, testId: Long) = DBAction { implicit rs =>
    val result = importExportService.enablePassword(candidateId, testId)
    result match {
      case Failure(e) => BadRequest(e.getMessage)
      case Success(_) => Ok("Password Enabled")
    }
  }
}
