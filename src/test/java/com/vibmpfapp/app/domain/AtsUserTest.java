package com.vibmpfapp.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.vibmpfapp.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AtsUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AtsUser.class);
        AtsUser atsUser1 = new AtsUser();
        atsUser1.setId(1L);
        AtsUser atsUser2 = new AtsUser();
        atsUser2.setId(atsUser1.getId());
        assertThat(atsUser1).isEqualTo(atsUser2);
        atsUser2.setId(2L);
        assertThat(atsUser1).isNotEqualTo(atsUser2);
        atsUser1.setId(null);
        assertThat(atsUser1).isNotEqualTo(atsUser2);
    }
}
