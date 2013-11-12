import sbt._
import Keys._
import play.Project._
import Dependencies._
import com.typesafe.sbt.SbtScalariform._
import scalariform.formatter.preferences._
import com.tuplejump.sbt.yeoman.Yeoman 
import java.net._
import scala.Some
import play.PlayRunHook

object ApplicationBuild extends Build {

val playbase = RootProject(file("modules/playbase"))

object Keys {
    val uiDirectory = SettingKey[File]("ui-directory")
  }

import Keys._

val assesspro = play.Project(Version.appName, Version.appVersion, appDependencies, path = file("assesspro") ).settings(
   Yeoman.yeomanSettings : _*).settings(
   scalacOptions ++= Options.scalaBuildOptions
  ).dependsOn(playbase % "test->test;compile->compile")
  .settings(defaultScalariformSettings: _*)
  .settings( 
      
    javascriptEntryPoints := Nil,
    // Add the views to the dist
    playAssetsDirectories <+= (baseDirectory in Compile)(base => base / "ui" / "app" / "views"),

    // Where does the UI live?
    uiDirectory <<= (baseDirectory in Compile) { _ / "ui" },       
    
    playRunHooks <+= baseDirectory.map(ui => Grunt(ui)),

    // Allow all the specified commands below to be run within sbt
    commands <++= uiDirectory { base =>
      Seq(
        "grunt",
        "bower",
        "yo",
        "npm"
      ).map(cmd(_, base))
    })
  

  ScalariformKeys.preferences := ScalariformKeys.preferences.value
                              .setPreference(AlignParameters, true)
                              .setPreference(AlignSingleLineCaseStatements, true)
                              .setPreference(DoubleIndentClassDeclaration, true)
                              .setPreference(PreserveDanglingCloseParenthesis, true)

  override def rootProject = Some(assesspro) 

   private def cmd(name: String, base: File): Command = {
    Command.args(name, "<" + name + "-command>") { (state, args) =>
      Process(name :: args.toList, base) !;
      state
    }
  }
}

object Grunt {
  def apply(base: File): PlayRunHook = {

    object GruntProcess extends PlayRunHook {

      var process: Option[Process] = None

      override def beforeStarted(): Unit = {
        //Process("grunt dist", base).run
      }

      override def afterStarted(addr: InetSocketAddress): Unit = {
        process = Some(Process("grunt run", base).run)
      }

      override def afterStopped(): Unit = {
        process.map(p => p.destroy())
        process = None
      }
    }

    GruntProcess
  }
}

