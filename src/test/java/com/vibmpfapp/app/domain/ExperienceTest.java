package com.vibmpfapp.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.vibmpfapp.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExperienceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Experience.class);
        Experience experience1 = new Experience();
        experience1.setId("id1");
        Experience experience2 = new Experience();
        experience2.setId(experience1.getId());
        assertThat(experience1).isEqualTo(experience2);
        experience2.setId("id2");
        assertThat(experience1).isNotEqualTo(experience2);
        experience1.setId(null);
        assertThat(experience1).isNotEqualTo(experience2);
    }
}
