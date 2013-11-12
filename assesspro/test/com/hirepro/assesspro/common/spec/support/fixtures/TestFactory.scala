package com.hirepro.assesspro.common.spec.support.fixtures

import org.joda.time.DateTime
import com.hirepro.assesspro.common.business.domain.models.Test

object TestFactory {
  def newTest = {
    Test(tenantId = 2, questionPaperId = 2, testDuration = 0, isTestActive = true, validFrom = Some(DateTime.now().minusDays(10)), validTo = Some(DateTime.now().plusDays(10)),
      isAllTimePermissible = false, testStartTime = Some(DateTime.now().minusHours(1)), testEndTime = Some(DateTime.now().plusHours(1)))
  }
}
