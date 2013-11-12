package com.hirepro.assesspro.common.business.domain.models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import com.diwa.playbase.framework.business.domain.models.Model

case class Tenant(id: Option[Long],
                  alias: String,
                  tenantName: String)
    extends Model[Tenant] {
  def withId(id: Long) = copy(id = Some(id))
}

object Tenant {
  implicit val tenantReads: Reads[Tenant] = (
    (__ \ "Id").readNullable[Long] and
    (__ \ "Alias").read[String] and
    (__ \ "TenantName").read[String])(Tenant.apply _)
    
    implicit val userWrites: Writes[Tenant] = (
    (__ \ "Id").write[Option[Long]] and
    (__ \ "Alias").write[String] and
    (__ \ "TenantName").write[String])(unlift(Tenant.unapply _)) 
}

