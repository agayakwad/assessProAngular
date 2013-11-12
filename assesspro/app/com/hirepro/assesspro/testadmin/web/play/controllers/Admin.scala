package com.hirepro.assesspro.testadmin.web.play.controllers

import com.google.inject._
import play.api.mvc._
import play.api.Play.current
import play.api.db.slick._
import play.api.libs._
import scala.collection
import play.api.libs.json._
import com.hirepro.assesspro.testadmin.web.play.views.html.{ admin => view }
import com.hirepro.assesspro.testadmin.business.application.services.ImportExportService

class Admin @Inject() (importExportService: ImportExportService) extends Controller {

  def index = DBAction { implicit rs =>
    val (tenants, tests, users, _) = importExportService.all
    Ok(view.dashboard(tenants, users, tests))
  }

  def admin = DBAction { implicit rs =>
    val (tenants, tests, users, _) = importExportService.all 
    val usersJson = Json.toJson(users)  
    Ok(usersJson)
  }

}
