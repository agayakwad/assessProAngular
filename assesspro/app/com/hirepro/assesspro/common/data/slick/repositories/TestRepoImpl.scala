package com.hirepro.assesspro.common.data.slick.repositories

import play.api.db.slick.Config.driver.simple._
import com.hirepro.assesspro.common.business.domain.models.Test
import com.hirepro.assesspro.common.business.domain.repositories.TestRepo
import com.hirepro.assesspro.common.data.slick.tables.{ TestTable, QuestionPaperCacheTable }
import com.diwa.playbase.framework.data.slick.repositories.DbRepo

class TestRepoImpl extends DbRepo[Test] with TestRepo {
  override val table = new TestTable
  val qpCacheTable = new QuestionPaperCacheTable
  val byTenantId = table.createFinderBy(_.tenantId)

  def getQuestionPaper(testId: Long)(implicit s: Session): Option[String] = {
    val json = for {
      (t, q) <- table innerJoin qpCacheTable on (_.questionPaperId === _.questionPaperId) if (t.id === testId)
    } yield (t.questionPaperId, q.questionPaperJson)
    json.firstOption map (_._2)
  }

  def findByTenantId(tenantId: Long)(implicit s: Session): Seq[Test] = byTenantId(tenantId).list
}
