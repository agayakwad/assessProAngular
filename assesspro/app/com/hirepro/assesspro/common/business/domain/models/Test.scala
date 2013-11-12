package com.hirepro.assesspro.common.business.domain.models

import org.joda.time.DateTime
import scala.util.{ Success, Failure, Try }
import com.diwa.playbase.framework.business.domain.models.Model

case class Test(id: Option[Long] = None,
                tenantId: Long = 0,
                questionPaperId: Long = 0,
                testDuration: Double = 0,
                name: Option[String] = None,
                validFrom: Option[DateTime] = None,
                validTo: Option[DateTime] = None,
                permissibleLateTime: Int = 0,
                testStartTime: Option[DateTime] = None,
                testEndTime: Option[DateTime] = None,
                isAllTimePermissible: Boolean = false,
                instructions: Option[String] = None,
                hasGroupWiseTiming: Boolean = false,
                isOptionRandomize: Boolean = false,
                typeOfTest: Int = 0,
                config: Option[String] = None,
                isTestActive: Boolean = false,
                isInstantResult: Boolean = false,
                noOfCandidates: Long = 0,
                instantEvaluation: Boolean = false,
                questionPaperTenantId: Int = 0,
                questionRandomizing: Boolean = false)
    extends Model[Test] {

  def withId(id: Long): Test = copy(id = Some(id))

  def tryReady: Try[Test] = {
    isInactive.flatMap(_.isInvalidDate.flatMap(_.isInvalidTime))
  }

  private def isInactive: Try[Test] = {
    if (isTestActive == false)
      Failure(new UnsupportedOperationException("Test is not Active"))
    else Success(this)
  }
  private def isInvalidDate: Try[Test] = {
    if ((validFrom.exists(_.isAfterNow)) || (validTo.exists(_.isBeforeNow)))
      Failure(new UnsupportedOperationException("Test is not valid"))
    else Success(this)
  }
  private def isInvalidTime: Try[Test] = {
    if (isAllTimePermissible)
      Success(this)
    else if ((testStartTime.exists(_.isAfterNow)) || (testEndTime.exists(_.isBeforeNow)))
      Failure(new UnsupportedOperationException("Test is not in time"))
    else
      Success(this)
  }
}
