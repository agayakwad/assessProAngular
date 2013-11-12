package com.hirepro.assesspro.testadmin.web.play.helpers

import com.hirepro.assesspro.common.business.domain.models.{ Tenant, Test, User }

object AdminHelper {
  def classForUserTable(user: User): String = {
    if (user.status == 1)
      "success"
    else if (user.isPasswordDisabled)
      "danger"
    else if (user.hasFinishedTest)
      "warning"
    else
      "normal"
  }

  def classForTestTable(test: Test): String = {
    if (test.tryReady.isSuccess)
      "warning"
    else
      "normal"
  }

  def idNameMapforTest(tests: Seq[Test]): Map[Long, Option[String]] = {
    tests.map(test => test.id.get -> test.name)(collection.breakOut)
  }

  def idNameMapForTenant(tenants: Seq[Tenant]): Map[Long, String] = {
    tenants.map(tenant => tenant.id.get -> tenant.tenantName)(collection.breakOut)
  }
}
