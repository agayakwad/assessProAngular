package com.hirepro.assesspro.web.play

import play.api.GlobalSettings
import com.google.inject._
import play.api.Play
import play.api.Play.current
import play.api.db.DB
import com.hirepro.assesspro.common.data.slick.modules.RepoBinderModule
import com.hirepro.assesspro.testadmin.business.application.modules.{ ServiceBinderModule => TestAdminServiceBinder }
import com.hirepro.assesspro.testserver.business.application.modules.{ ServiceBinderModule => TestServerServiceBinder }
import com.diwa.playbase.framework.data.slick.{DbInfo, SlickModule, SlickDatabase}

case class MyDbInfo() extends DbInfo {
  def database = SlickDatabase.forDataSource(DB.getDataSource()(Play.current))
  def driverName = Play.current.configuration.getString("db.default.driver").get
}

object Global extends GlobalSettings {
  lazy val injector = {
    Play.isProd match {
      case true  => Guice.createInjector(new RepoBinderModule(), new TestAdminServiceBinder(), new TestServerServiceBinder() /*, new SlickModule(new MyDbInfo())*/ )
      case false => Guice.createInjector(new RepoBinderModule(), new TestAdminServiceBinder(), new TestServerServiceBinder() /*, new SlickModule(new MyDbInfo())*/ )
    }
  }

  override def getControllerInstance[A](clazz: Class[A]) = {
    injector.getInstance(clazz)
  }
}
