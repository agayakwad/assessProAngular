package com.hirepro.assesspro.testserver.business.application.services.impl

import play.api.db.slick.DB
import slick.session.Session
import play.api.libs.json.Json
import com.hirepro.assesspro.common.data.slick.repositories.{ UserRepoImpl, TestResponseCacheRepoImpl }
import com.hirepro.assesspro.testserver.business.application.services.ResponseService
import com.diwa.playbase.framework.spec.support.{ServiceSpec, WithInMemoryApplication}

class ResponseServiceSpec extends ServiceSpec[ResponseService] {
  "Response Service" should {
    "accept partial submissions" in new WithInMemoryApplication {
      DB.withSession { implicit s: Session =>

        val testResponseCacheRepo = new TestResponseCacheRepoImpl()
        val userRepo = new UserRepoImpl()
        val service = new ResponseServiceImpl(testResponseCacheRepo, userRepo)
        val submitJson = """
        {"TestUserId":"3","IsPartialSubmission":false, "TestId" : "2", "TenantId" : "2", "TotalTimeSpent":0,"TimeStamp":"8/4/2013 18:0:45","Answers":[{"Q":9612,"A":"D","TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9613,"A":null,"TimeSpent":1375619440,"SecId":1296,"QTenantId":233},{"Q":9623,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9622,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9621,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9620,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233}],"TestUserGroupInfoCollection":{}}
          		  """
        service.submit(Json.parse(submitJson))
        testResponseCacheRepo.count must equalTo(1)

      }
    }

    "accept multiple partial submissions from same user" in new WithInMemoryApplication {
      DB.withSession { implicit s: Session =>

        val testResponseCacheRepo = new TestResponseCacheRepoImpl()
        val userRepo = new UserRepoImpl()
        val service = new ResponseServiceImpl(testResponseCacheRepo, userRepo)
        val submitJson = """
        {"TestUserId":"3","IsPartialSubmission":false, "TestId" : "2", "TenantId" : "2", "TotalTimeSpent":0,"TimeStamp":"8/4/2013 18:0:45","Answers":[{"Q":9612,"A":"D","TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9613,"A":null,"TimeSpent":1375619440,"SecId":1296,"QTenantId":233},{"Q":9623,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9622,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9621,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9620,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233}],"TestUserGroupInfoCollection":{}}
          		  """
        service.submit(Json.parse(submitJson))
        testResponseCacheRepo.count must equalTo(1)
        service.submit(Json.parse(submitJson))
        testResponseCacheRepo.count must equalTo(1)

      }
    }

    "accept partial submissions from multiple users" in new WithInMemoryApplication {
      DB.withSession { implicit s: Session =>

        val testResponseCacheRepo = new TestResponseCacheRepoImpl()
        val userRepo = new UserRepoImpl()
        val service = new ResponseServiceImpl(testResponseCacheRepo, userRepo)
        val submitJson = """
        {"TestUserId":"3","IsPartialSubmission":false, "TestId" : "2", "TenantId" : "2", "TotalTimeSpent":0,"TimeStamp":"8/4/2013 18:0:45","Answers":[{"Q":9612,"A":"D","TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9613,"A":null,"TimeSpent":1375619440,"SecId":1296,"QTenantId":233},{"Q":9623,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9622,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9621,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9620,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233}],"TestUserGroupInfoCollection":{}}
          		  		"""
        service.submit(Json.parse(submitJson))
        val anotherUserSubmitJson = """
        {"TestUserId":"4","IsPartialSubmission":false, "TestId" : "2", "TenantId" : "2", "TotalTimeSpent":0,"TimeStamp":"8/4/2013 18:0:45","Answers":[{"Q":9612,"A":"D","TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9613,"A":null,"TimeSpent":1375619440,"SecId":1296,"QTenantId":233},{"Q":9623,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9622,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9621,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233},{"Q":9620,"A":null,"TimeSpent":0,"SecId":1296,"QTenantId":233}],"TestUserGroupInfoCollection":{}}
      		  						"""
        service.submit(Json.parse(anotherUserSubmitJson))
        testResponseCacheRepo.count must equalTo(2)

      }
    }
  }

}