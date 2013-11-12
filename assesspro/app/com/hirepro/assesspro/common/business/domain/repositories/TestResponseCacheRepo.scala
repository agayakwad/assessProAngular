package com.hirepro.assesspro.common.business.domain.repositories

import scala.slick.session.Session
import com.hirepro.assesspro.common.business.domain.models.TestResponseCache
import com.diwa.playbase.framework.business.domain.repositories.Repo

trait TestResponseCacheRepo extends Repo[TestResponseCache] {
  def upsert(tenantId: Long, testUserId: Long, testId: Long, isPartialSubmit: Boolean, testResponseCache: String)(implicit s: Session): TestResponseCache
  def findByTenantId(tenantId: Long)(implicit s: Session): Seq[TestResponseCache]
}
