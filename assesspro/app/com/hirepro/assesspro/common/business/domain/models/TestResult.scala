package com.hirepro.assesspro.common.business.domain.models

import com.diwa.playbase.framework.business.domain.models.Model

case class TestResult(id: Option[Long],
                      questionId: Long = 0,
                      answerString: Option[String],
                      isSubjective: Int = 0,
                      testUserId: Option[Long] = None,
                      timeSpent: Double = 0,
                      sectionId: Long = 0,
                      questionTenantId: Long = 0)
    extends Model[TestResult] {
  def withId(id: Long) = copy(id = Some(id))
}