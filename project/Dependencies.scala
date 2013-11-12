import sbt._
import Keys._
import play.Project._

object Version {
  val appName         = "assesspro"
  val appVersion      = "0.1-SNAPSHOT"
}

object Options {
  val scalaBuildOptions = Seq(
  "-feature",
  "-deprecation",
  "-unchecked",
  "-Ywarn-all", // doesn't actually turn them all on :-\
  "-Yno-adapted-args",
  "-Ywarn-numeric-widen",
  "-Ywarn-dead-code", // confused by ???, sadly
  "-Ywarn-inaccessible",
  "-Ywarn-nullary-override",
  " -Ywarn-nullary-unit",
  "-Xlint"
)
  val viewAutoImports = Seq("com.hirepro.assesspro.common.business.domain.models._")
}

object Library {
  val webjarsPlay         = "org.webjars" %% "webjars-play" % "2.2.0-RC1"
  val jQuery              = "org.webjars" % "jquery" % "1.10.2"
  val bootstrap           = "org.webjars" % "bootstrap" % "3.0.0"
  val jQueryDataTables    = "org.webjars" % "datatables" % "1.9.4-2"
  val bsjQueryDataTables  = "org.webjars" % "datatables-bootstrap" % "2-20120201-1"
  val mySQL               = "mysql" % "mysql-connector-java" % "5.1.26"
  val slickPlay           = "com.typesafe.play" %% "play-slick" % "0.5.0.2-SNAPSHOT"
  val guiceScala          = "net.codingwell" %% "scala-guice" % "4.0.0-beta"
  val selenium            = "org.seleniumhq.selenium" % "selenium-java" % "2.35.0"
  val mockito             = "org.mockito" % "mockito-core" % "1.9.5"
  val pegDown             = "org.pegdown" % "pegdown" % "1.4.1"
  val classCycle          = "org.specs2" % "classycle" % "1.4.1"
}

object Dependencies {
  import Library._
  val appDependencies = Seq(
    jdbc,
    webjarsPlay,
    jQuery,
    bootstrap,
    jQueryDataTables,
    bsjQueryDataTables,
    mySQL,
    slickPlay,
    guiceScala,
    selenium    % "test",
    mockito     % "test",
    pegDown     % "test",
    classCycle  % "test"
  )
}
