package com.vibmpfapp.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.vibmpfapp.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RemarkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Remark.class);
        Remark remark1 = new Remark();
        remark1.setId(1L);
        Remark remark2 = new Remark();
        remark2.setId(remark1.getId());
        assertThat(remark1).isEqualTo(remark2);
        remark2.setId(2L);
        assertThat(remark1).isNotEqualTo(remark2);
        remark1.setId(null);
        assertThat(remark1).isNotEqualTo(remark2);
    }
}
