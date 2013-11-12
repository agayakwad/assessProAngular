package com.hirepro.assesspro.common.business.domain.models

import org.joda.time.DateTime
import com.hirepro.assesspro.common.spec.support.fixtures.TestFactory
import com.diwa.playbase.framework.spec.support.ModelSpec

class TestSpec extends ModelSpec[Test] {

  "Test" should {
    "not be takeable when inactive" in {
      val test = TestFactory.newTest.copy(isTestActive = false)
      test.tryReady must beFailedTry
    }

    "not be takeable before valid start date" in {
      val test = TestFactory.newTest.copy(validFrom = Some(DateTime.now().plusDays(1)))
      test.tryReady must beFailedTry
    }

    "not be takeable after valid end date" in {
      val test = TestFactory.newTest.copy(validTo = Some(DateTime.now().minusDays(1)))
      test.tryReady must beFailedTry
    }

    "not be takeable before start time" in {
      val test = TestFactory.newTest.copy(testStartTime = Some(DateTime.now().plusHours(1)))
      test.tryReady must beFailedTry
    }

    "not be takeable after end time" in {
      val test = TestFactory.newTest.copy(testEndTime = Some(DateTime.now().minusHours(1)))
      test.tryReady must beFailedTry
    }

    "be takeable if when active" in {
      val test = TestFactory.newTest.copy(isTestActive = true)
      test.tryReady must beSuccessfulTry
    }

    "be takeable after valid start date" in {
      val test = TestFactory.newTest.copy(validFrom = Some(DateTime.now().minusDays(1)))
      test.tryReady must beSuccessfulTry
    }

    "be takeable before valid end date" in {
      val test = TestFactory.newTest.copy(validTo = Some(DateTime.now().plusDays(1)))
      test.tryReady must beSuccessfulTry
    }

    "be takeable when no start date is specified" in {
      val test = TestFactory.newTest.copy(validFrom = None)
      test.tryReady must beSuccessfulTry
    }

    "be takeable when no end date is specified" in {
      val test = TestFactory.newTest.copy(validTo = None)
      test.tryReady must beSuccessfulTry
    }

    "be takeable at all times if allTimePermissible is specified" in {
      val test = TestFactory.newTest.copy(isAllTimePermissible = true)
      test.tryReady must beSuccessfulTry
    }

    "be takeable after start time" in {
      val test = TestFactory.newTest.copy(testStartTime = Some(DateTime.now().minusHours(1)))
      test.tryReady must beSuccessfulTry
    }

    "be takeable before end time" in {
      val test = TestFactory.newTest.copy(testEndTime = Some(DateTime.now().plusHours(1)))
      test.tryReady must beSuccessfulTry
    }
  }
}
