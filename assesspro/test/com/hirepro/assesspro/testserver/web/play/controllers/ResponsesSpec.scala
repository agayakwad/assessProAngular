package com.hirepro.assesspro.testserver.web.play.controllers

import play.api.test._
import play.api.test.Helpers._
import play.api.libs.json.Json
import com.hirepro.assesspro.testserver.business.application.services.impl.ResponseServiceImpl
import com.hirepro.assesspro.common.data.slick.repositories.{ UserRepoImpl, TestResponseCacheRepoImpl }
import com.diwa.playbase.framework.spec.support.{ControllerIntegrationSpec, WithInMemoryApplication}

class ResponsesSpec extends ControllerIntegrationSpec[Responses] {

  "Response Controller" should {
    "respond to submit action" in new WithInMemoryApplication {
      val testResponseCacheRepo = new TestResponseCacheRepoImpl()
      val userRepo = new UserRepoImpl()
      val controller = new Responses(new ResponseServiceImpl(testResponseCacheRepo, userRepo))
      val submitJson = """
        {"TestUserId":"3","IsPartialSubmission":false, "TestId" : "2", "TenantId" : "2", "TotalTimeSpent":0,"TimeStamp":"8/4/2013 18:0:45","Answers":[{"Q":9612,"A":"D","TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9613,"A":null,"TimeSpent":1375619440,"SecId":1296,"QTenantId":233},{"Q":9623,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9622,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9621,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9620,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233}],"TestUserGroupInfoCollection":{}}
    		  """
      val result = controller.submit()(FakeRequest().withJsonBody(Json.parse(submitJson)))

      status(result) must_== OK
    }
  }
}