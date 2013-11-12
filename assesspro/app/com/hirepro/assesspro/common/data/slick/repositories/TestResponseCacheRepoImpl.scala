package com.hirepro.assesspro.common.data.slick.repositories

import play.api.db.slick.Config.driver.simple._
import com.hirepro.assesspro.common.business.domain.models.TestResponseCache
import com.hirepro.assesspro.common.business.domain.repositories.TestResponseCacheRepo
import com.hirepro.assesspro.common.data.slick.tables.TestResponseCacheTable
import com.diwa.playbase.framework.data.slick.repositories.DbRepo

class TestResponseCacheRepoImpl extends DbRepo[TestResponseCache] with TestResponseCacheRepo {
  override val table = new TestResponseCacheTable
  val byTenantId = table.createFinderBy(_.tenantId)

  def upsert(tenantId: Long, testUserId: Long, testId: Long, isPartialSubmit: Boolean, testResponseCache: String)(implicit s: Session): TestResponseCache = {
    val maybeId = table.where(_.testUserId === testUserId).where(_.tenantId === tenantId).map(_.id).firstOption
    save(TestResponseCache(maybeId, tenantId, testUserId, testId, isPartialSubmit, testResponseCache))
  }

  def findByTenantId(tenantId: Long)(implicit s: Session): Seq[TestResponseCache] = byTenantId(tenantId).list
}