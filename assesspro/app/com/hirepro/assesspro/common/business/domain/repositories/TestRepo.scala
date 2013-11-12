package com.hirepro.assesspro.common.business.domain.repositories

import scala.slick.session.Session
import com.hirepro.assesspro.common.business.domain.models.Test
import com.diwa.playbase.framework.business.domain.repositories.Repo

trait TestRepo extends Repo[Test] {
  def getQuestionPaper(testId: Long)(implicit s: Session): Option[String]
  def findByTenantId(tenantId: Long)(implicit s: Session): Seq[Test]
}
