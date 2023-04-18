package com.vibmpfapp.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.vibmpfapp.app.IntegrationTest;
import com.vibmpfapp.app.domain.CompanyApplicationStatus;
import com.vibmpfapp.app.repository.CompanyApplicationStatusRepository;
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
 * Integration tests for the {@link CompanyApplicationStatusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CompanyApplicationStatusResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/company-application-statuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompanyApplicationStatusRepository companyApplicationStatusRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompanyApplicationStatusMockMvc;

    private CompanyApplicationStatus companyApplicationStatus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompanyApplicationStatus createEntity(EntityManager em) {
        CompanyApplicationStatus companyApplicationStatus = new CompanyApplicationStatus().name(DEFAULT_NAME);
        return companyApplicationStatus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompanyApplicationStatus createUpdatedEntity(EntityManager em) {
        CompanyApplicationStatus companyApplicationStatus = new CompanyApplicationStatus().name(UPDATED_NAME);
        return companyApplicationStatus;
    }

    @BeforeEach
    public void initTest() {
        companyApplicationStatus = createEntity(em);
    }

    @Test
    @Transactional
    void createCompanyApplicationStatus() throws Exception {
        int databaseSizeBeforeCreate = companyApplicationStatusRepository.findAll().size();
        // Create the CompanyApplicationStatus
        restCompanyApplicationStatusMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyApplicationStatus))
            )
            .andExpect(status().isCreated());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeCreate + 1);
        CompanyApplicationStatus testCompanyApplicationStatus = companyApplicationStatusList.get(companyApplicationStatusList.size() - 1);
        assertThat(testCompanyApplicationStatus.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createCompanyApplicationStatusWithExistingId() throws Exception {
        // Create the CompanyApplicationStatus with an existing ID
        companyApplicationStatus.setId(1L);

        int databaseSizeBeforeCreate = companyApplicationStatusRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompanyApplicationStatusMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyApplicationStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCompanyApplicationStatuses() throws Exception {
        // Initialize the database
        companyApplicationStatusRepository.saveAndFlush(companyApplicationStatus);

        // Get all the companyApplicationStatusList
        restCompanyApplicationStatusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companyApplicationStatus.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getCompanyApplicationStatus() throws Exception {
        // Initialize the database
        companyApplicationStatusRepository.saveAndFlush(companyApplicationStatus);

        // Get the companyApplicationStatus
        restCompanyApplicationStatusMockMvc
            .perform(get(ENTITY_API_URL_ID, companyApplicationStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(companyApplicationStatus.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingCompanyApplicationStatus() throws Exception {
        // Get the companyApplicationStatus
        restCompanyApplicationStatusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompanyApplicationStatus() throws Exception {
        // Initialize the database
        companyApplicationStatusRepository.saveAndFlush(companyApplicationStatus);

        int databaseSizeBeforeUpdate = companyApplicationStatusRepository.findAll().size();

        // Update the companyApplicationStatus
        CompanyApplicationStatus updatedCompanyApplicationStatus = companyApplicationStatusRepository
            .findById(companyApplicationStatus.getId())
            .get();
        // Disconnect from session so that the updates on updatedCompanyApplicationStatus are not directly saved in db
        em.detach(updatedCompanyApplicationStatus);
        updatedCompanyApplicationStatus.name(UPDATED_NAME);

        restCompanyApplicationStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompanyApplicationStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompanyApplicationStatus))
            )
            .andExpect(status().isOk());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeUpdate);
        CompanyApplicationStatus testCompanyApplicationStatus = companyApplicationStatusList.get(companyApplicationStatusList.size() - 1);
        assertThat(testCompanyApplicationStatus.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingCompanyApplicationStatus() throws Exception {
        int databaseSizeBeforeUpdate = companyApplicationStatusRepository.findAll().size();
        companyApplicationStatus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompanyApplicationStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, companyApplicationStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyApplicationStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompanyApplicationStatus() throws Exception {
        int databaseSizeBeforeUpdate = companyApplicationStatusRepository.findAll().size();
        companyApplicationStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyApplicationStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyApplicationStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompanyApplicationStatus() throws Exception {
        int databaseSizeBeforeUpdate = companyApplicationStatusRepository.findAll().size();
        companyApplicationStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyApplicationStatusMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyApplicationStatus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompanyApplicationStatusWithPatch() throws Exception {
        // Initialize the database
        companyApplicationStatusRepository.saveAndFlush(companyApplicationStatus);

        int databaseSizeBeforeUpdate = companyApplicationStatusRepository.findAll().size();

        // Update the companyApplicationStatus using partial update
        CompanyApplicationStatus partialUpdatedCompanyApplicationStatus = new CompanyApplicationStatus();
        partialUpdatedCompanyApplicationStatus.setId(companyApplicationStatus.getId());

        partialUpdatedCompanyApplicationStatus.name(UPDATED_NAME);

        restCompanyApplicationStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompanyApplicationStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompanyApplicationStatus))
            )
            .andExpect(status().isOk());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeUpdate);
        CompanyApplicationStatus testCompanyApplicationStatus = companyApplicationStatusList.get(companyApplicationStatusList.size() - 1);
        assertThat(testCompanyApplicationStatus.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateCompanyApplicationStatusWithPatch() throws Exception {
        // Initialize the database
        companyApplicationStatusRepository.saveAndFlush(companyApplicationStatus);

        int databaseSizeBeforeUpdate = companyApplicationStatusRepository.findAll().size();

        // Update the companyApplicationStatus using partial update
        CompanyApplicationStatus partialUpdatedCompanyApplicationStatus = new CompanyApplicationStatus();
        partialUpdatedCompanyApplicationStatus.setId(companyApplicationStatus.getId());

        partialUpdatedCompanyApplicationStatus.name(UPDATED_NAME);

        restCompanyApplicationStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompanyApplicationStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompanyApplicationStatus))
            )
            .andExpect(status().isOk());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeUpdate);
        CompanyApplicationStatus testCompanyApplicationStatus = companyApplicationStatusList.get(companyApplicationStatusList.size() - 1);
        assertThat(testCompanyApplicationStatus.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingCompanyApplicationStatus() throws Exception {
        int databaseSizeBeforeUpdate = companyApplicationStatusRepository.findAll().size();
        companyApplicationStatus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompanyApplicationStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, companyApplicationStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(companyApplicationStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompanyApplicationStatus() throws Exception {
        int databaseSizeBeforeUpdate = companyApplicationStatusRepository.findAll().size();
        companyApplicationStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyApplicationStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(companyApplicationStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompanyApplicationStatus() throws Exception {
        int databaseSizeBeforeUpdate = companyApplicationStatusRepository.findAll().size();
        companyApplicationStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyApplicationStatusMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(companyApplicationStatus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompanyApplicationStatus in the database
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompanyApplicationStatus() throws Exception {
        // Initialize the database
        companyApplicationStatusRepository.saveAndFlush(companyApplicationStatus);

        int databaseSizeBeforeDelete = companyApplicationStatusRepository.findAll().size();

        // Delete the companyApplicationStatus
        restCompanyApplicationStatusMockMvc
            .perform(delete(ENTITY_API_URL_ID, companyApplicationStatus.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompanyApplicationStatus> companyApplicationStatusList = companyApplicationStatusRepository.findAll();
        assertThat(companyApplicationStatusList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
