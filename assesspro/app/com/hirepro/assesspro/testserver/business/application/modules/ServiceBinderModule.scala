package com.hirepro.assesspro.testserver.business.application.modules

import com.google.inject._
import net.codingwell.scalaguice.ScalaModule
import com.hirepro.assesspro.testserver.business.application.services.{ TestService, ResponseService, AuthenticationService }
import com.hirepro.assesspro.testserver.business.application.services.impl.{ TestServiceImpl, ResponseServiceImpl, AuthenticationServiceImpl }

class ServiceBinderModule extends AbstractModule with ScalaModule {
  def configure {
    bind[AuthenticationService].to[AuthenticationServiceImpl].in[Singleton]
    bind[ResponseService].to[ResponseServiceImpl].in[Singleton]
    bind[TestService].to[TestServiceImpl].in[Singleton]
  }
}
