package com.hirepro.assesspro.common.data.slick.repositories

import scala.slick.session.Session
import com.hirepro.assesspro.common.business.domain.models.Tenant
import com.hirepro.assesspro.common.business.domain.repositories.TenantRepo
import com.hirepro.assesspro.common.data.slick.tables.TenantTable
import com.diwa.playbase.framework.data.slick.repositories.DbRepo

class TenantRepoImpl extends DbRepo[Tenant] with TenantRepo {
  override val table = new TenantTable

  val byAlias = table.createFinderBy(_.alias)

  def findByAlias(alias: String)(implicit s: Session): Option[Tenant] =
    byAlias(alias).firstOption
}
