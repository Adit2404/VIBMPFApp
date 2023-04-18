package com.vibmpfapp.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.vibmpfapp.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AtsApplicationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AtsApplication.class);
        AtsApplication atsApplication1 = new AtsApplication();
        atsApplication1.setId(1L);
        AtsApplication atsApplication2 = new AtsApplication();
        atsApplication2.setId(atsApplication1.getId());
        assertThat(atsApplication1).isEqualTo(atsApplication2);
        atsApplication2.setId(2L);
        assertThat(atsApplication1).isNotEqualTo(atsApplication2);
        atsApplication1.setId(null);
        assertThat(atsApplication1).isNotEqualTo(atsApplication2);
    }
}
