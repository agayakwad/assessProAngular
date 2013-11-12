package com.hirepro.assesspro.common.business.domain.models

import com.diwa.playbase.framework.business.domain.models.Model

case class TestResponseCache(id: Option[Long],
                             tenantId: Long,
                             testUserId: Long,
                             testId: Long,
                             isPartialSubmit: Boolean = true,
                             testResponseJson: String)
    extends Model[TestResponseCache] {
  def withId(id: Long) = copy(id = Some(id))
}
