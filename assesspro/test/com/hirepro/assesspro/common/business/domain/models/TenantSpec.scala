package com.hirepro.assesspro.common.business.domain.models

import play.api.libs.json.Json
import com.diwa.playbase.framework.spec.support.ModelSpec

class TenantSpec extends ModelSpec[Tenant] {

  "Tenant" should {

    "be successfully constructed from Valid JSON" in {
      val tenantJson = Json.obj(
        "Id" -> 23,
        "Alias" -> "DummyAlias",
        "TenantName" -> "DummyName"
      )

      val tenant = tenantJson.as[Tenant]

      tenant.id must beSome(23)
      tenant.alias must_== "DummyAlias"
      tenant.tenantName must_== "DummyName"
    }
  }
}
