package com.hirepro.assesspro.common.data.slick.tables

import play.api.db.slick.Config.driver.simple._
import com.hirepro.framework.data.slick.tables.RepoTable
import com.hirepro.assesspro.common.business.domain.models.TestResponseCache

class TestResponseCacheTable extends RepoTable[TestResponseCache]("test_result_cache") {
  def tenantId = column[Long]("tenant_id", O.DBType("INT(11)"))
  def testUserId = column[Long]("testuser_id", O.DBType("INT(11)"))
  def testId = column[Long]("test_id", O.DBType("INT(11)"))
  def isPartialSubmit = column[Boolean]("is_partial_submit", O.Default(false))
  def testResponseJson = column[String]("testresponse_json", O.DBType("text"))

  def * = id.? ~ tenantId ~ testUserId ~ testId ~ isPartialSubmit ~ testResponseJson <> (TestResponseCache.apply _, TestResponseCache.unapply _)
}
