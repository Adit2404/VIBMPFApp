package com.vibmpfapp.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.vibmpfapp.app.IntegrationTest;
import com.vibmpfapp.app.domain.Education;
import com.vibmpfapp.app.repository.EducationRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
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
 * Integration tests for the {@link EducationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EducationResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_SDATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_SDATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_EDATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EDATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/educations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEducationMockMvc;

    private Education education;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Education createEntity(EntityManager em) {
        Education education = new Education()
            .title(DEFAULT_TITLE)
            .company(DEFAULT_COMPANY)
            .location(DEFAULT_LOCATION)
            .sdate(DEFAULT_SDATE)
            .edate(DEFAULT_EDATE)
            .description(DEFAULT_DESCRIPTION);
        return education;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Education createUpdatedEntity(EntityManager em) {
        Education education = new Education()
            .title(UPDATED_TITLE)
            .company(UPDATED_COMPANY)
            .location(UPDATED_LOCATION)
            .sdate(UPDATED_SDATE)
            .edate(UPDATED_EDATE)
            .description(UPDATED_DESCRIPTION);
        return education;
    }

    @BeforeEach
    public void initTest() {
        education = createEntity(em);
    }

    @Test
    @Transactional
    void createEducation() throws Exception {
        int databaseSizeBeforeCreate = educationRepository.findAll().size();
        // Create the Education
        restEducationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(education)))
            .andExpect(status().isCreated());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeCreate + 1);
        Education testEducation = educationList.get(educationList.size() - 1);
        assertThat(testEducation.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testEducation.getCompany()).isEqualTo(DEFAULT_COMPANY);
        assertThat(testEducation.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testEducation.getSdate()).isEqualTo(DEFAULT_SDATE);
        assertThat(testEducation.getEdate()).isEqualTo(DEFAULT_EDATE);
        assertThat(testEducation.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createEducationWithExistingId() throws Exception {
        // Create the Education with an existing ID
        education.setId("existing_id");

        int databaseSizeBeforeCreate = educationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEducationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(education)))
            .andExpect(status().isBadRequest());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEducations() throws Exception {
        // Initialize the database
        education.setId(UUID.randomUUID().toString());
        educationRepository.saveAndFlush(education);

        // Get all the educationList
        restEducationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(education.getId())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].company").value(hasItem(DEFAULT_COMPANY)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].sdate").value(hasItem(DEFAULT_SDATE.toString())))
            .andExpect(jsonPath("$.[*].edate").value(hasItem(DEFAULT_EDATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getEducation() throws Exception {
        // Initialize the database
        education.setId(UUID.randomUUID().toString());
        educationRepository.saveAndFlush(education);

        // Get the education
        restEducationMockMvc
            .perform(get(ENTITY_API_URL_ID, education.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(education.getId()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.company").value(DEFAULT_COMPANY))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.sdate").value(DEFAULT_SDATE.toString()))
            .andExpect(jsonPath("$.edate").value(DEFAULT_EDATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingEducation() throws Exception {
        // Get the education
        restEducationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEducation() throws Exception {
        // Initialize the database
        education.setId(UUID.randomUUID().toString());
        educationRepository.saveAndFlush(education);

        int databaseSizeBeforeUpdate = educationRepository.findAll().size();

        // Update the education
        Education updatedEducation = educationRepository.findById(education.getId()).get();
        // Disconnect from session so that the updates on updatedEducation are not directly saved in db
        em.detach(updatedEducation);
        updatedEducation
            .title(UPDATED_TITLE)
            .company(UPDATED_COMPANY)
            .location(UPDATED_LOCATION)
            .sdate(UPDATED_SDATE)
            .edate(UPDATED_EDATE)
            .description(UPDATED_DESCRIPTION);

        restEducationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEducation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEducation))
            )
            .andExpect(status().isOk());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeUpdate);
        Education testEducation = educationList.get(educationList.size() - 1);
        assertThat(testEducation.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testEducation.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testEducation.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testEducation.getSdate()).isEqualTo(UPDATED_SDATE);
        assertThat(testEducation.getEdate()).isEqualTo(UPDATED_EDATE);
        assertThat(testEducation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingEducation() throws Exception {
        int databaseSizeBeforeUpdate = educationRepository.findAll().size();
        education.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEducationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, education.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(education))
            )
            .andExpect(status().isBadRequest());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEducation() throws Exception {
        int databaseSizeBeforeUpdate = educationRepository.findAll().size();
        education.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(education))
            )
            .andExpect(status().isBadRequest());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEducation() throws Exception {
        int databaseSizeBeforeUpdate = educationRepository.findAll().size();
        education.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(education)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEducationWithPatch() throws Exception {
        // Initialize the database
        education.setId(UUID.randomUUID().toString());
        educationRepository.saveAndFlush(education);

        int databaseSizeBeforeUpdate = educationRepository.findAll().size();

        // Update the education using partial update
        Education partialUpdatedEducation = new Education();
        partialUpdatedEducation.setId(education.getId());

        partialUpdatedEducation.sdate(UPDATED_SDATE).edate(UPDATED_EDATE);

        restEducationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEducation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEducation))
            )
            .andExpect(status().isOk());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeUpdate);
        Education testEducation = educationList.get(educationList.size() - 1);
        assertThat(testEducation.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testEducation.getCompany()).isEqualTo(DEFAULT_COMPANY);
        assertThat(testEducation.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testEducation.getSdate()).isEqualTo(UPDATED_SDATE);
        assertThat(testEducation.getEdate()).isEqualTo(UPDATED_EDATE);
        assertThat(testEducation.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateEducationWithPatch() throws Exception {
        // Initialize the database
        education.setId(UUID.randomUUID().toString());
        educationRepository.saveAndFlush(education);

        int databaseSizeBeforeUpdate = educationRepository.findAll().size();

        // Update the education using partial update
        Education partialUpdatedEducation = new Education();
        partialUpdatedEducation.setId(education.getId());

        partialUpdatedEducation
            .title(UPDATED_TITLE)
            .company(UPDATED_COMPANY)
            .location(UPDATED_LOCATION)
            .sdate(UPDATED_SDATE)
            .edate(UPDATED_EDATE)
            .description(UPDATED_DESCRIPTION);

        restEducationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEducation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEducation))
            )
            .andExpect(status().isOk());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeUpdate);
        Education testEducation = educationList.get(educationList.size() - 1);
        assertThat(testEducation.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testEducation.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testEducation.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testEducation.getSdate()).isEqualTo(UPDATED_SDATE);
        assertThat(testEducation.getEdate()).isEqualTo(UPDATED_EDATE);
        assertThat(testEducation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingEducation() throws Exception {
        int databaseSizeBeforeUpdate = educationRepository.findAll().size();
        education.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEducationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, education.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(education))
            )
            .andExpect(status().isBadRequest());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEducation() throws Exception {
        int databaseSizeBeforeUpdate = educationRepository.findAll().size();
        education.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(education))
            )
            .andExpect(status().isBadRequest());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEducation() throws Exception {
        int databaseSizeBeforeUpdate = educationRepository.findAll().size();
        education.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(education))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Education in the database
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEducation() throws Exception {
        // Initialize the database
        education.setId(UUID.randomUUID().toString());
        educationRepository.saveAndFlush(education);

        int databaseSizeBeforeDelete = educationRepository.findAll().size();

        // Delete the education
        restEducationMockMvc
            .perform(delete(ENTITY_API_URL_ID, education.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Education> educationList = educationRepository.findAll();
        assertThat(educationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
