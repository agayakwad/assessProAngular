package com.hirepro.assesspro.common.data.slick.tables

import play.api.db.slick.Config.driver.simple._
import com.hirepro.framework.data.slick.tables.RepoTable
import com.hirepro.assesspro.common.business.domain.models.QuestionPaperCache

class QuestionPaperCacheTable extends RepoTable[QuestionPaperCache]("question_paper_cache") {
  def tenantId = column[Long]("tenant_id", O.DBType("INT(11)"), O.Default(0))
  def questionPaperId = column[Long]("question_paper_id", O.DBType("INT(11)"), O.Default(0))
  def questionPaperJson = column[String]("question_paper_json", O.DBType("text"))

  def * = id.? ~ tenantId ~ questionPaperId ~ questionPaperJson <> (QuestionPaperCache.apply _, QuestionPaperCache.unapply _)
}
