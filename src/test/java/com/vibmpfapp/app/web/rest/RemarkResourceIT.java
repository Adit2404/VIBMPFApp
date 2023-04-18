package com.vibmpfapp.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.vibmpfapp.app.IntegrationTest;
import com.vibmpfapp.app.domain.Remark;
import com.vibmpfapp.app.repository.RemarkRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RemarkResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RemarkResourceIT {

    private static final String DEFAULT_MESSAGE = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/remarks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RemarkRepository remarkRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRemarkMockMvc;

    private Remark remark;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Remark createEntity(EntityManager em) {
        Remark remark = new Remark().message(DEFAULT_MESSAGE).date(DEFAULT_DATE);
        return remark;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Remark createUpdatedEntity(EntityManager em) {
        Remark remark = new Remark().message(UPDATED_MESSAGE).date(UPDATED_DATE);
        return remark;
    }

    @BeforeEach
    public void initTest() {
        remark = createEntity(em);
    }

    @Test
    @Transactional
    void createRemark() throws Exception {
        int databaseSizeBeforeCreate = remarkRepository.findAll().size();
        // Create the Remark
        restRemarkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(remark)))
            .andExpect(status().isCreated());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeCreate + 1);
        Remark testRemark = remarkList.get(remarkList.size() - 1);
        assertThat(testRemark.getMessage()).isEqualTo(DEFAULT_MESSAGE);
        assertThat(testRemark.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createRemarkWithExistingId() throws Exception {
        // Create the Remark with an existing ID
        remark.setId(1L);

        int databaseSizeBeforeCreate = remarkRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRemarkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(remark)))
            .andExpect(status().isBadRequest());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRemarks() throws Exception {
        // Initialize the database
        remarkRepository.saveAndFlush(remark);

        // Get all the remarkList
        restRemarkMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(remark.getId().intValue())))
            .andExpect(jsonPath("$.[*].message").value(hasItem(DEFAULT_MESSAGE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getRemark() throws Exception {
        // Initialize the database
        remarkRepository.saveAndFlush(remark);

        // Get the remark
        restRemarkMockMvc
            .perform(get(ENTITY_API_URL_ID, remark.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(remark.getId().intValue()))
            .andExpect(jsonPath("$.message").value(DEFAULT_MESSAGE))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingRemark() throws Exception {
        // Get the remark
        restRemarkMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRemark() throws Exception {
        // Initialize the database
        remarkRepository.saveAndFlush(remark);

        int databaseSizeBeforeUpdate = remarkRepository.findAll().size();

        // Update the remark
        Remark updatedRemark = remarkRepository.findById(remark.getId()).get();
        // Disconnect from session so that the updates on updatedRemark are not directly saved in db
        em.detach(updatedRemark);
        updatedRemark.message(UPDATED_MESSAGE).date(UPDATED_DATE);

        restRemarkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRemark.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRemark))
            )
            .andExpect(status().isOk());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeUpdate);
        Remark testRemark = remarkList.get(remarkList.size() - 1);
        assertThat(testRemark.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testRemark.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingRemark() throws Exception {
        int databaseSizeBeforeUpdate = remarkRepository.findAll().size();
        remark.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRemarkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, remark.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(remark))
            )
            .andExpect(status().isBadRequest());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRemark() throws Exception {
        int databaseSizeBeforeUpdate = remarkRepository.findAll().size();
        remark.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRemarkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(remark))
            )
            .andExpect(status().isBadRequest());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRemark() throws Exception {
        int databaseSizeBeforeUpdate = remarkRepository.findAll().size();
        remark.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRemarkMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(remark)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRemarkWithPatch() throws Exception {
        // Initialize the database
        remarkRepository.saveAndFlush(remark);

        int databaseSizeBeforeUpdate = remarkRepository.findAll().size();

        // Update the remark using partial update
        Remark partialUpdatedRemark = new Remark();
        partialUpdatedRemark.setId(remark.getId());

        partialUpdatedRemark.date(UPDATED_DATE);

        restRemarkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRemark.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRemark))
            )
            .andExpect(status().isOk());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeUpdate);
        Remark testRemark = remarkList.get(remarkList.size() - 1);
        assertThat(testRemark.getMessage()).isEqualTo(DEFAULT_MESSAGE);
        assertThat(testRemark.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateRemarkWithPatch() throws Exception {
        // Initialize the database
        remarkRepository.saveAndFlush(remark);

        int databaseSizeBeforeUpdate = remarkRepository.findAll().size();

        // Update the remark using partial update
        Remark partialUpdatedRemark = new Remark();
        partialUpdatedRemark.setId(remark.getId());

        partialUpdatedRemark.message(UPDATED_MESSAGE).date(UPDATED_DATE);

        restRemarkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRemark.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRemark))
            )
            .andExpect(status().isOk());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeUpdate);
        Remark testRemark = remarkList.get(remarkList.size() - 1);
        assertThat(testRemark.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testRemark.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingRemark() throws Exception {
        int databaseSizeBeforeUpdate = remarkRepository.findAll().size();
        remark.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRemarkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, remark.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(remark))
            )
            .andExpect(status().isBadRequest());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRemark() throws Exception {
        int databaseSizeBeforeUpdate = remarkRepository.findAll().size();
        remark.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRemarkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(remark))
            )
            .andExpect(status().isBadRequest());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRemark() throws Exception {
        int databaseSizeBeforeUpdate = remarkRepository.findAll().size();
        remark.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRemarkMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(remark)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Remark in the database
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRemark() throws Exception {
        // Initialize the database
        remarkRepository.saveAndFlush(remark);

        int databaseSizeBeforeDelete = remarkRepository.findAll().size();

        // Delete the remark
        restRemarkMockMvc
            .perform(delete(ENTITY_API_URL_ID, remark.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Remark> remarkList = remarkRepository.findAll();
        assertThat(remarkList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
