package com.hirepro.assesspro.common.business.domain.models

import com.diwa.playbase.framework.business.domain.models.Model

case class QuestionPaperCache(id: Option[Long],
                              tenantId: Long,
                              questionPaperId: Long,
                              questionPaperJson: String)
    extends Model[QuestionPaperCache] {
  def withId(id: Long) = copy(id = Some(id))
}

