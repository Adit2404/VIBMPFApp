package com.vibmpfapp.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.vibmpfapp.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CompanyApplicationStatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompanyApplicationStatus.class);
        CompanyApplicationStatus companyApplicationStatus1 = new CompanyApplicationStatus();
        companyApplicationStatus1.setId(1L);
        CompanyApplicationStatus companyApplicationStatus2 = new CompanyApplicationStatus();
        companyApplicationStatus2.setId(companyApplicationStatus1.getId());
        assertThat(companyApplicationStatus1).isEqualTo(companyApplicationStatus2);
        companyApplicationStatus2.setId(2L);
        assertThat(companyApplicationStatus1).isNotEqualTo(companyApplicationStatus2);
        companyApplicationStatus1.setId(null);
        assertThat(companyApplicationStatus1).isNotEqualTo(companyApplicationStatus2);
    }
}
