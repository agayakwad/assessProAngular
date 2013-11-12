package com.hirepro.assesspro.common.spec.support.fixtures

import com.hirepro.assesspro.common.business.domain.models.User

object UserFactory {
  def newUser = User(None, "dummy", "dummy", None, 1L, candidateName = Some("Dummy"), candidateEmail = Some("dummy@dummy.com"))
}
