package com.hirepro.assesspro.testadmin.business.application.services.impl

import scala.slick.session.Session
import play.api.db.slick.DB
import play.api.libs.json.Json
import com.hirepro.assesspro.testserver.business.application.services.impl.{ ResponseServiceImpl, AuthenticationServiceImpl }
import com.hirepro.assesspro.common.data.slick.repositories._
import com.hirepro.assesspro.web.play.Global
import org.specs2.matcher.JsonMatchers
import java.io.File
import com.hirepro.assesspro.testadmin.business.application.services.ImportExportService
import com.diwa.playbase.framework.spec.support.{ServiceSpec, WithInMemoryApplication}

class ImportExportServiceSpec extends ServiceSpec[ImportExportService] with JsonMatchers {

  "Import" should {

    "update database successfully" in new WithInMemoryApplication {
      DB.withSession { implicit s: Session =>
        val importService = Global.getControllerInstance(classOf[ImportExportService])
        val file = new File("test/resources/532.zip")
        importService.importTest(file) must beSuccessfulTry
        val tenant = new TenantRepoImpl().findByAlias("disaster")
        tenant must beSome
        val test = new TestRepoImpl().getOption(532)
        test must beSome
        val users = new UserRepoImpl().findByTest(532)
        users.size must_== 27
        val qp = new TestRepoImpl().getQuestionPaper(532)
        qp must beSome
      }
    }
  }

  "Export" should {
    "export tenant to string" in new WithInMemoryApplication {
      DB.withSession { implicit s: Session =>
        val authService = new AuthenticationServiceImpl(new UserRepoImpl())
        authService.authenticate("third", "third", "t2")
        val testResponseCacheRepo = new TestResponseCacheRepoImpl()
        val userRepo = new UserRepoImpl()
        val responseService = new ResponseServiceImpl(testResponseCacheRepo, userRepo)
        val submitJson = """
        {"TestUserId":"3","IsPartialSubmission":true, "TestId" : "2", "TenantId" : "2", "TotalTimeSpent":0,"TimeStamp":"8/4/2013 18:0:45","Answers":[{"Q":9612,"A":"D","TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9613,"A":null,"TimeSpent":1375619440,"SecId":1296,"QTenantId":233},{"Q":9623,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9622,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9621,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9620,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233}],"TestUserGroupInfoCollection":{}}
          		  """
        responseService.submit(Json.parse(submitJson))

        val anotherUserSubmitJson = """
        {"TestUserId":"4","IsPartialSubmission":false, "TestId" : "2", "TenantId" : "2", "TotalTimeSpent":0,"TimeStamp":"8/4/2013 18:0:45","Answers":[{"Q":9612,"A":"C","TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9613,"A":null,"TimeSpent":1375619440,"SecId":1296,"QTenantId":233},{"Q":9623,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9622,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9621,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9620,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233}],"TestUserGroupInfoCollection":{}}
	  						"""
        responseService.submit(Json.parse(anotherUserSubmitJson))

        authService.authenticate("fifth", "fifth", "t2")
        val newTestSubmitJson = """
        {"TestUserId":"5","IsPartialSubmission":true, "TestId" : "3", "TenantId" : "2", "TotalTimeSpent":0,"TimeStamp":"8/4/2013 18:0:45","Answers":[{"Q":9612,"A":"A","TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9613,"A":null,"TimeSpent":1375619440,"SecId":1296,"QTenantId":233},{"Q":9623,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9622,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9621,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9620,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233}],"TestUserGroupInfoCollection":{}}
          		  """
        responseService.submit(Json.parse(newTestSubmitJson))

        val service = new ImportExportServiceImpl(new TenantRepoImpl(), new TestRepoImpl(), userRepo, new QuestionPaperCacheRepoImpl(), testResponseCacheRepo)
        val json = service.exportTestToJson(2)
      }
    }
  }
}
