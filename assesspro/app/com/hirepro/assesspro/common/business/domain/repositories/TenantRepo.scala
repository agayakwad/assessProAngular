package com.hirepro.assesspro.common.business.domain.repositories

import scala.slick.session.Session
import com.hirepro.assesspro.common.business.domain.models.Tenant
import com.diwa.playbase.framework.business.domain.repositories.Repo

trait TenantRepo extends Repo[Tenant] {
  def findByAlias(alias: String)(implicit s: Session): Option[Tenant]
}
