package com.hirepro.assesspro.web.play.plugins

import play.api.test._
import play.api.test.Helpers._
import com.diwa.playbase.framework.spec.support.BaseSpec

class BootstrapPluginSpec extends BaseSpec {

  def pluginSetting(setting: Boolean) = {
    Map("bootstrapplugin" -> (setting match {
      case true  => "enabled"
      case false => "disabled"
    }))
  }

  def testApp(setting: Option[Boolean] = None): FakeApplication = {
    val pluginConfig = setting match {
      case None       => Seq()
      case Some(bool) => pluginSetting(bool)
    }
    FakeApplication(additionalConfiguration = inMemoryDatabase() ++ pluginConfig)
  }

  def noConfigApp = testApp()
  def configEnabledApp = testApp(Some(true))
  def configDisabledApp = testApp(Some(false))

  "Bootstrap Plugin" should {

    //TODO : Find a better way to test this
    /*
    "be inactive when not specified" in new WithApplication(noConfigApp) {
      DB.withSession { implicit s: Session =>
        
        app.plugin(classOf[BootstrapDataPlugin]) must beNone
      }
    }
    */
    "be inactive when disabled" in new WithApplication(configDisabledApp) {
      app.plugin(classOf[BootstrapDataPlugin]) must beNone
    }

    "be active when enabled" in new WithApplication(configEnabledApp) {
      app.plugin(classOf[BootstrapDataPlugin]) must not beNone
    }
  }
}