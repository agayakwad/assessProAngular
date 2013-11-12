package com.hirepro.assesspro.testadmin.business.application.modules

import com.google.inject._
import net.codingwell.scalaguice.ScalaModule
import com.hirepro.assesspro.testadmin.business.application.services.ImportExportService
import com.hirepro.assesspro.testadmin.business.application.services.impl.ImportExportServiceImpl

class ServiceBinderModule extends AbstractModule with ScalaModule {
  def configure {
    bind[ImportExportService].to[ImportExportServiceImpl].in[Singleton]
  }
}
