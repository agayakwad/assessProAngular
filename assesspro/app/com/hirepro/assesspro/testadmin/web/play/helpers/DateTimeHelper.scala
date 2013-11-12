package com.hirepro.assesspro.testadmin.web.play.helpers

import org.joda.time.{ Period, DateTime }
import org.joda.time.format.{ PeriodFormat, PeriodFormatterBuilder, PeriodFormatter }

object DateTimeHelper {
  def relativeElapsed(dateTime: DateTime): String = {
    val now = new DateTime()
    val period = new Period(dateTime, now)

    val formatter: PeriodFormatter = new PeriodFormatterBuilder()
      .appendYears().appendSuffix(" years\n")
      .appendMonths().appendSuffix(" months\n")
      .appendWeeks().appendSuffix(" weeks\n")
      .appendDays().appendSuffix(" days\n")
      .appendHours().appendSuffix(" hours\n")
      .appendMinutes().appendSuffix(" mins\n")
      .appendSeconds().appendSuffix(" sec\n")
      .printZeroNever()
      .toFormatter

    val elapsed = formatter.print(period) + " ago"
    elapsed
  }

  def relativeElapsed(dateTime: Option[DateTime]): String = {
    dateTime match {
      case None     => ""
      case Some(dt) => relativeElapsed(dt)
    }
  }

}
