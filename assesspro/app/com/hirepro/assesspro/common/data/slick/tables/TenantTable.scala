package com.hirepro.assesspro.common.data.slick.tables

import play.api.db.slick.Config.driver.simple._
import com.hirepro.framework.data.slick.tables.RepoTable
import com.hirepro.assesspro.common.business.domain.models.Tenant

class TenantTable extends RepoTable[Tenant]("tenants") {
  def alias = column[String]("alias")
  def tenantName = column[String]("tenant_name")

  def * = id.? ~ alias ~ tenantName <> (Tenant.apply _, Tenant.unapply _)
}
