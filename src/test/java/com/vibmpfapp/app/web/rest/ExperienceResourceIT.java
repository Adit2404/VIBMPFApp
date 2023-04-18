package com.vibmpfapp.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.vibmpfapp.app.IntegrationTest;
import com.vibmpfapp.app.domain.Experience;
import com.vibmpfapp.app.repository.ExperienceRepository;
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
 * Integration tests for the {@link ExperienceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExperienceResourceIT {

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

    private static final String ENTITY_API_URL = "/api/experiences";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExperienceMockMvc;

    private Experience experience;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Experience createEntity(EntityManager em) {
        Experience experience = new Experience()
            .title(DEFAULT_TITLE)
            .company(DEFAULT_COMPANY)
            .location(DEFAULT_LOCATION)
            .sdate(DEFAULT_SDATE)
            .edate(DEFAULT_EDATE)
            .description(DEFAULT_DESCRIPTION);
        return experience;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Experience createUpdatedEntity(EntityManager em) {
        Experience experience = new Experience()
            .title(UPDATED_TITLE)
            .company(UPDATED_COMPANY)
            .location(UPDATED_LOCATION)
            .sdate(UPDATED_SDATE)
            .edate(UPDATED_EDATE)
            .description(UPDATED_DESCRIPTION);
        return experience;
    }

    @BeforeEach
    public void initTest() {
        experience = createEntity(em);
    }

    @Test
    @Transactional
    void createExperience() throws Exception {
        int databaseSizeBeforeCreate = experienceRepository.findAll().size();
        // Create the Experience
        restExperienceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(experience)))
            .andExpect(status().isCreated());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeCreate + 1);
        Experience testExperience = experienceList.get(experienceList.size() - 1);
        assertThat(testExperience.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testExperience.getCompany()).isEqualTo(DEFAULT_COMPANY);
        assertThat(testExperience.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testExperience.getSdate()).isEqualTo(DEFAULT_SDATE);
        assertThat(testExperience.getEdate()).isEqualTo(DEFAULT_EDATE);
        assertThat(testExperience.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createExperienceWithExistingId() throws Exception {
        // Create the Experience with an existing ID
        experience.setId("existing_id");

        int databaseSizeBeforeCreate = experienceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExperienceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(experience)))
            .andExpect(status().isBadRequest());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExperiences() throws Exception {
        // Initialize the database
        experience.setId(UUID.randomUUID().toString());
        experienceRepository.saveAndFlush(experience);

        // Get all the experienceList
        restExperienceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(experience.getId())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].company").value(hasItem(DEFAULT_COMPANY)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].sdate").value(hasItem(DEFAULT_SDATE.toString())))
            .andExpect(jsonPath("$.[*].edate").value(hasItem(DEFAULT_EDATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getExperience() throws Exception {
        // Initialize the database
        experience.setId(UUID.randomUUID().toString());
        experienceRepository.saveAndFlush(experience);

        // Get the experience
        restExperienceMockMvc
            .perform(get(ENTITY_API_URL_ID, experience.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(experience.getId()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.company").value(DEFAULT_COMPANY))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.sdate").value(DEFAULT_SDATE.toString()))
            .andExpect(jsonPath("$.edate").value(DEFAULT_EDATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingExperience() throws Exception {
        // Get the experience
        restExperienceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExperience() throws Exception {
        // Initialize the database
        experience.setId(UUID.randomUUID().toString());
        experienceRepository.saveAndFlush(experience);

        int databaseSizeBeforeUpdate = experienceRepository.findAll().size();

        // Update the experience
        Experience updatedExperience = experienceRepository.findById(experience.getId()).get();
        // Disconnect from session so that the updates on updatedExperience are not directly saved in db
        em.detach(updatedExperience);
        updatedExperience
            .title(UPDATED_TITLE)
            .company(UPDATED_COMPANY)
            .location(UPDATED_LOCATION)
            .sdate(UPDATED_SDATE)
            .edate(UPDATED_EDATE)
            .description(UPDATED_DESCRIPTION);

        restExperienceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExperience.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExperience))
            )
            .andExpect(status().isOk());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeUpdate);
        Experience testExperience = experienceList.get(experienceList.size() - 1);
        assertThat(testExperience.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testExperience.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testExperience.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testExperience.getSdate()).isEqualTo(UPDATED_SDATE);
        assertThat(testExperience.getEdate()).isEqualTo(UPDATED_EDATE);
        assertThat(testExperience.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingExperience() throws Exception {
        int databaseSizeBeforeUpdate = experienceRepository.findAll().size();
        experience.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExperienceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, experience.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(experience))
            )
            .andExpect(status().isBadRequest());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExperience() throws Exception {
        int databaseSizeBeforeUpdate = experienceRepository.findAll().size();
        experience.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExperienceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(experience))
            )
            .andExpect(status().isBadRequest());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExperience() throws Exception {
        int databaseSizeBeforeUpdate = experienceRepository.findAll().size();
        experience.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExperienceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(experience)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExperienceWithPatch() throws Exception {
        // Initialize the database
        experience.setId(UUID.randomUUID().toString());
        experienceRepository.saveAndFlush(experience);

        int databaseSizeBeforeUpdate = experienceRepository.findAll().size();

        // Update the experience using partial update
        Experience partialUpdatedExperience = new Experience();
        partialUpdatedExperience.setId(experience.getId());

        partialUpdatedExperience.company(UPDATED_COMPANY).edate(UPDATED_EDATE).description(UPDATED_DESCRIPTION);

        restExperienceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExperience.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExperience))
            )
            .andExpect(status().isOk());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeUpdate);
        Experience testExperience = experienceList.get(experienceList.size() - 1);
        assertThat(testExperience.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testExperience.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testExperience.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testExperience.getSdate()).isEqualTo(DEFAULT_SDATE);
        assertThat(testExperience.getEdate()).isEqualTo(UPDATED_EDATE);
        assertThat(testExperience.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateExperienceWithPatch() throws Exception {
        // Initialize the database
        experience.setId(UUID.randomUUID().toString());
        experienceRepository.saveAndFlush(experience);

        int databaseSizeBeforeUpdate = experienceRepository.findAll().size();

        // Update the experience using partial update
        Experience partialUpdatedExperience = new Experience();
        partialUpdatedExperience.setId(experience.getId());

        partialUpdatedExperience
            .title(UPDATED_TITLE)
            .company(UPDATED_COMPANY)
            .location(UPDATED_LOCATION)
            .sdate(UPDATED_SDATE)
            .edate(UPDATED_EDATE)
            .description(UPDATED_DESCRIPTION);

        restExperienceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExperience.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExperience))
            )
            .andExpect(status().isOk());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeUpdate);
        Experience testExperience = experienceList.get(experienceList.size() - 1);
        assertThat(testExperience.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testExperience.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testExperience.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testExperience.getSdate()).isEqualTo(UPDATED_SDATE);
        assertThat(testExperience.getEdate()).isEqualTo(UPDATED_EDATE);
        assertThat(testExperience.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingExperience() throws Exception {
        int databaseSizeBeforeUpdate = experienceRepository.findAll().size();
        experience.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExperienceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, experience.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(experience))
            )
            .andExpect(status().isBadRequest());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExperience() throws Exception {
        int databaseSizeBeforeUpdate = experienceRepository.findAll().size();
        experience.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExperienceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(experience))
            )
            .andExpect(status().isBadRequest());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExperience() throws Exception {
        int databaseSizeBeforeUpdate = experienceRepository.findAll().size();
        experience.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExperienceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(experience))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Experience in the database
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExperience() throws Exception {
        // Initialize the database
        experience.setId(UUID.randomUUID().toString());
        experienceRepository.saveAndFlush(experience);

        int databaseSizeBeforeDelete = experienceRepository.findAll().size();

        // Delete the experience
        restExperienceMockMvc
            .perform(delete(ENTITY_API_URL_ID, experience.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Experience> experienceList = experienceRepository.findAll();
        assertThat(experienceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
