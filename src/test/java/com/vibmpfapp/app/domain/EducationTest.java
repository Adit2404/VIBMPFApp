package com.vibmpfapp.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.vibmpfapp.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EducationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Education.class);
        Education education1 = new Education();
        education1.setId("id1");
        Education education2 = new Education();
        education2.setId(education1.getId());
        assertThat(education1).isEqualTo(education2);
        education2.setId("id2");
        assertThat(education1).isNotEqualTo(education2);
        education1.setId(null);
        assertThat(education1).isNotEqualTo(education2);
    }
}
