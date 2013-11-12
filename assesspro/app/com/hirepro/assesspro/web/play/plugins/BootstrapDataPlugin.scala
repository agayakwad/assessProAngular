package com.hirepro.assesspro.web.play.plugins

import play.api.{ Logger, Application, Plugin }
import models._
import play.api.db.slick._
import play.api.Play.current
import org.joda.time.DateTime
import com.hirepro.assesspro.common.business.domain.models.{ User, Test, Tenant, QuestionPaperCache }
import com.hirepro.assesspro.common.data.slick.repositories.{ UserRepoImpl, TestRepoImpl, TenantRepoImpl, QuestionPaperCacheRepoImpl }

class BootstrapDataPlugin(app: Application) extends Plugin {
  override def enabled = app.configuration.getString("bootstrapplugin").map(_ == "enabled").headOption.getOrElse(false)

  override def onStart() {
    InitialData.insert()
  }

  override def onStop() {

  }

  object InitialData {

    val tenants = Seq(
      Tenant(Option(1L), "t1", "Helpless Placard"),
      Tenant(Option(2L), "t2", "Uncommon Flooring"),
      Tenant(Option(3L), "txs", "Tax For Sure"),
      Tenant(Option(4L), "pws", "Polar Was"),
      Tenant(Option(5L), "trm", "Tree Minds"))

    val tests = Seq(
      Test(Option(1L), 1L, 1L, 11D, Option("Test1"), None, None, 0, None, None, true, Option("Do well"), true, true, 0, Option(""), false, true, 3L, true, 0, true),
      Test(Option(2L), 2L, 2L, 21D, Option("Test2"), None, None, 0, None, None, true, Option("Do well"), false, true, 0, Option(""), true, true, 3L, true, 0, true),
      Test(Option(3L), 2L, 2L, 31D, Option("Test3"), None, None, 0, None, None, true, Option("Do well"), false, true, 0, Option(""), true, true, 3L, true, 0, true),
      Test(Option(4L), 3L, 2L, 31D, Option("Test4"), None, None, 0, None, None, true, Option("Do well"), false, true, 0, Option(""), false, true, 21L, true, 0, true),
      Test(Option(5L), 3L, 2L, 45D, Option("Test5"), None, None, 0, None, None, true, Option("Do well"), false, true, 0, Option(""), false, true, 4L, true, 0, true),
      Test(Option(6L), 4L, 2L, 45D, Option("Test6"), None, None, 0, None, None, true, Option("Do well"), false, true, 0, Option(""), false, true, 5L, true, 0, true))

    val users = Seq(
      User(Option(1L), "first", "first", Option(1L), 1L, candidateName = Some("Sonu Nigam"), candidateEmail = Some("test1@test.com")),
      User(Option(2L), "second", "second", Option(1L), 2L, candidateName = Some("Sonu Sood"), candidateEmail = Some("test2@test.com")),
      User(Option(3L), "third", "third", Option(2L), 3L, candidateName = Some("Sonu Sharma"), candidateEmail = Some("test3@test.com")),
      User(Option(4L), "fourth", "fourth", Option(2L), 4L, candidateName = Some("Sonu Kumar"), candidateEmail = Some("test4@test.com")),
      User(Option(5L), "fifth", "fifth", Option(3L), 5L, candidateName = Some("New Kumar"), candidateEmail = Some("test5@test.com")))

    val questionPaperCaches = Seq(
      QuestionPaperCache(Option(1L), 1L, 1L, "first json"),
      QuestionPaperCache(Option(2L), 2L, 2L, """ {"CreatedObjectId":0,"IsException":false,"IsFailure":false,"Message":"Get Question for Online Assesment Successful","GroupWiseTiming":false,"IsOptionRandomize":true,"IsOptionalGroup":false,"JsonGroupWithQuestioncollectionForMandatorySection":[{"Id":996,"Name":"IF@Aps","SectionTypeCollection":[{"Instruction":"The following questions are multiple choice questions. Each question has one correct answer.","InstructionId":2641,"Name":"Aptitude","QuestionType":[{"AnswerChoiceCollection":[{"Choice":"A","HTMLString":"<p>\t5</p>"},{"Choice":"B","HTMLString":"<p>\t3</p>"},{"Choice":"C","HTMLString":"<p>\t9</p>"},{"Choice":"D","HTMLString":"<p>\t6</p>"}],"HTMLString":"<p>\t3+3+3=?</p>","QuestionId":9623,"QuestionTenantId":233,"TypeOfQuestion":7,"TypeOfQuestionText":"MCQ"},{"AnswerChoiceCollection":[{"Choice":"A","HTMLString":"<p>\t1</p>"},{"Choice":"B","HTMLString":"<p>\t2</p>"},{"Choice":"C","HTMLString":"<p>\t3</p>"},{"Choice":"D","HTMLString":"<p>\t4</p>"},{"Choice":"E","HTMLString":"<p>\t5</p>"}],"HTMLString":"<p>\t2-2+2=?</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p><p>\t&nbsp;</p>","QuestionId":9622,"QuestionTenantId":233,"TypeOfQuestion":7,"TypeOfQuestionText":"MCQ"},{"AnswerChoiceCollection":[{"Choice":"A","HTMLString":"<p>\t5</p>"},{"Choice":"B","HTMLString":"<p>\t6</p>"},{"Choice":"C","HTMLString":"<p>\t4</p>"},{"Choice":"D","HTMLString":"<p>\tall of the above</p>"}],"HTMLString":"<p>\t1 + 3 = ?</p>","QuestionId":9621,"QuestionTenantId":233,"TypeOfQuestion":7,"TypeOfQuestionText":"MCQ"},{"AnswerChoiceCollection":[{"Choice":"A","HTMLString":"<p>\t5</p>"},{"Choice":"B","HTMLString":"<p>\t4</p>"},{"Choice":"C","HTMLString":"<p>\t6</p>"},{"Choice":"D","HTMLString":"<p>\t10</p>"}],"HTMLString":"<p>\tA+B = C?</p><p>\tA = 2;<br />\tB = 3;<br />\t&nbsp;</p>","QuestionId":9620,"QuestionTenantId":233,"TypeOfQuestion":7,"TypeOfQuestionText":"MCQ"},{"AnswerChoiceCollection":[{"Choice":"A","HTMLString":"<p>\tPen</p>"},{"Choice":"B","HTMLString":"<p>\tNib</p>"},{"Choice":"C","HTMLString":"<p>\tAuthor</p>"},{"Choice":"D","HTMLString":"<p>\tInk</p>"}],"HTMLString":"<p>\tWhat is this?</p><p>\t<img src=\"http://qaserver/AmsWeb/TestImages/Que_233_662/51901.png\" /></p>","QuestionId":9613,"QuestionTenantId":233,"TypeOfQuestion":7,"TypeOfQuestionText":"MCQ"},{"AnswerChoiceCollection":[{"Choice":"A","HTMLString":"<p>\tCandidates</p>"},{"Choice":"B","HTMLString":"<p>\tGirl and Boy</p>"},{"Choice":"C","HTMLString":"<p>\tPeople</p>"},{"Choice":"D","HTMLString":"<p>\tNothing</p>"}],"HTMLString":"<p>\tWha is this?</p><p>\t<img src=\"http://qaserver/AmsWeb/TestImages/Que_233_662/51900.png\" /></p>","QuestionId":9612,"QuestionTenantId":233,"TypeOfQuestion":7,"TypeOfQuestionText":"MCQ"}],"SectionId":1296}]}],"JsonGroupWithQuestioncollectionForNonMandatorySection":[]}"""))

    def insert(): Unit = {
      DB.withTransaction { implicit s: Session =>
        val userRepo = new UserRepoImpl
        if (userRepo.count == 0) {
          new TenantRepoImpl().insertAll(tenants: _*)
          new TestRepoImpl().insertAll(tests: _*)
          userRepo.insertAll(users: _*)
          new QuestionPaperCacheRepoImpl().insertAll(questionPaperCaches: _*)
        }
      }
    }
  }

}