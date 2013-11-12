package com.hirepro.assesspro.common.data.slick.modules

import com.google.inject._
import net.codingwell.scalaguice.ScalaModule
import com.hirepro.assesspro.common.business.domain.repositories._
import com.hirepro.assesspro.common.data.slick.repositories._

class RepoBinderModule extends AbstractModule with ScalaModule {
  def configure {
    bind[UserRepo].to[UserRepoImpl].in[Singleton]
    bind[TenantRepo].to[TenantRepoImpl].in[Singleton]
    bind[TestRepo].to[TestRepoImpl].in[Singleton]
    bind[QuestionPaperCacheRepo].to[QuestionPaperCacheRepoImpl].in[Singleton]
    bind[TestResponseCacheRepo].to[TestResponseCacheRepoImpl].in[Singleton]
  }
}
