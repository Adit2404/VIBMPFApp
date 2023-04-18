package com.vibmpfapp.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.vibmpfapp.app.IntegrationTest;
import com.vibmpfapp.app.domain.AtsApplication;
import com.vibmpfapp.app.repository.AtsApplicationRepository;
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
 * Integration tests for the {@link AtsApplicationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AtsApplicationResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/ats-applications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AtsApplicationRepository atsApplicationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAtsApplicationMockMvc;

    private AtsApplication atsApplication;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AtsApplication createEntity(EntityManager em) {
        AtsApplication atsApplication = new AtsApplication().date(DEFAULT_DATE);
        return atsApplication;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AtsApplication createUpdatedEntity(EntityManager em) {
        AtsApplication atsApplication = new AtsApplication().date(UPDATED_DATE);
        return atsApplication;
    }

    @BeforeEach
    public void initTest() {
        atsApplication = createEntity(em);
    }

    @Test
    @Transactional
    void createAtsApplication() throws Exception {
        int databaseSizeBeforeCreate = atsApplicationRepository.findAll().size();
        // Create the AtsApplication
        restAtsApplicationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atsApplication))
            )
            .andExpect(status().isCreated());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeCreate + 1);
        AtsApplication testAtsApplication = atsApplicationList.get(atsApplicationList.size() - 1);
        assertThat(testAtsApplication.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createAtsApplicationWithExistingId() throws Exception {
        // Create the AtsApplication with an existing ID
        atsApplication.setId(1L);

        int databaseSizeBeforeCreate = atsApplicationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAtsApplicationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atsApplication))
            )
            .andExpect(status().isBadRequest());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAtsApplications() throws Exception {
        // Initialize the database
        atsApplicationRepository.saveAndFlush(atsApplication);

        // Get all the atsApplicationList
        restAtsApplicationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(atsApplication.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getAtsApplication() throws Exception {
        // Initialize the database
        atsApplicationRepository.saveAndFlush(atsApplication);

        // Get the atsApplication
        restAtsApplicationMockMvc
            .perform(get(ENTITY_API_URL_ID, atsApplication.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(atsApplication.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAtsApplication() throws Exception {
        // Get the atsApplication
        restAtsApplicationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAtsApplication() throws Exception {
        // Initialize the database
        atsApplicationRepository.saveAndFlush(atsApplication);

        int databaseSizeBeforeUpdate = atsApplicationRepository.findAll().size();

        // Update the atsApplication
        AtsApplication updatedAtsApplication = atsApplicationRepository.findById(atsApplication.getId()).get();
        // Disconnect from session so that the updates on updatedAtsApplication are not directly saved in db
        em.detach(updatedAtsApplication);
        updatedAtsApplication.date(UPDATED_DATE);

        restAtsApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAtsApplication.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAtsApplication))
            )
            .andExpect(status().isOk());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeUpdate);
        AtsApplication testAtsApplication = atsApplicationList.get(atsApplicationList.size() - 1);
        assertThat(testAtsApplication.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingAtsApplication() throws Exception {
        int databaseSizeBeforeUpdate = atsApplicationRepository.findAll().size();
        atsApplication.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAtsApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, atsApplication.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(atsApplication))
            )
            .andExpect(status().isBadRequest());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAtsApplication() throws Exception {
        int databaseSizeBeforeUpdate = atsApplicationRepository.findAll().size();
        atsApplication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtsApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(atsApplication))
            )
            .andExpect(status().isBadRequest());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAtsApplication() throws Exception {
        int databaseSizeBeforeUpdate = atsApplicationRepository.findAll().size();
        atsApplication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtsApplicationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atsApplication)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAtsApplicationWithPatch() throws Exception {
        // Initialize the database
        atsApplicationRepository.saveAndFlush(atsApplication);

        int databaseSizeBeforeUpdate = atsApplicationRepository.findAll().size();

        // Update the atsApplication using partial update
        AtsApplication partialUpdatedAtsApplication = new AtsApplication();
        partialUpdatedAtsApplication.setId(atsApplication.getId());

        restAtsApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAtsApplication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAtsApplication))
            )
            .andExpect(status().isOk());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeUpdate);
        AtsApplication testAtsApplication = atsApplicationList.get(atsApplicationList.size() - 1);
        assertThat(testAtsApplication.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateAtsApplicationWithPatch() throws Exception {
        // Initialize the database
        atsApplicationRepository.saveAndFlush(atsApplication);

        int databaseSizeBeforeUpdate = atsApplicationRepository.findAll().size();

        // Update the atsApplication using partial update
        AtsApplication partialUpdatedAtsApplication = new AtsApplication();
        partialUpdatedAtsApplication.setId(atsApplication.getId());

        partialUpdatedAtsApplication.date(UPDATED_DATE);

        restAtsApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAtsApplication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAtsApplication))
            )
            .andExpect(status().isOk());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeUpdate);
        AtsApplication testAtsApplication = atsApplicationList.get(atsApplicationList.size() - 1);
        assertThat(testAtsApplication.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingAtsApplication() throws Exception {
        int databaseSizeBeforeUpdate = atsApplicationRepository.findAll().size();
        atsApplication.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAtsApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, atsApplication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(atsApplication))
            )
            .andExpect(status().isBadRequest());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAtsApplication() throws Exception {
        int databaseSizeBeforeUpdate = atsApplicationRepository.findAll().size();
        atsApplication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtsApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(atsApplication))
            )
            .andExpect(status().isBadRequest());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAtsApplication() throws Exception {
        int databaseSizeBeforeUpdate = atsApplicationRepository.findAll().size();
        atsApplication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtsApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(atsApplication))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AtsApplication in the database
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAtsApplication() throws Exception {
        // Initialize the database
        atsApplicationRepository.saveAndFlush(atsApplication);

        int databaseSizeBeforeDelete = atsApplicationRepository.findAll().size();

        // Delete the atsApplication
        restAtsApplicationMockMvc
            .perform(delete(ENTITY_API_URL_ID, atsApplication.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AtsApplication> atsApplicationList = atsApplicationRepository.findAll();
        assertThat(atsApplicationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
