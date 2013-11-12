package com.hirepro.assesspro.common.data.slick.repositories

import com.hirepro.assesspro.common.business.domain.models.QuestionPaperCache
import com.hirepro.assesspro.common.business.domain.repositories.QuestionPaperCacheRepo
import com.hirepro.assesspro.common.data.slick.tables.QuestionPaperCacheTable
import com.diwa.playbase.framework.data.slick.repositories.DbRepo

class QuestionPaperCacheRepoImpl extends DbRepo[QuestionPaperCache] with QuestionPaperCacheRepo {
  override val table = new QuestionPaperCacheTable
}
