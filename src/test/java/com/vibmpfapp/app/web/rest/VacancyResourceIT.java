package com.vibmpfapp.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.vibmpfapp.app.IntegrationTest;
import com.vibmpfapp.app.domain.Vacancy;
import com.vibmpfapp.app.repository.VacancyRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link VacancyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VacancyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_OF_POSTING = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_OF_POSTING = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_EMPLOYMENT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_EMPLOYMENT_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_VIDEO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_VIDEO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_VIDEO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_VIDEO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_OPEN = false;
    private static final Boolean UPDATED_IS_OPEN = true;

    private static final String ENTITY_API_URL = "/api/vacancies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VacancyRepository vacancyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVacancyMockMvc;

    private Vacancy vacancy;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vacancy createEntity(EntityManager em) {
        Vacancy vacancy = new Vacancy()
            .name(DEFAULT_NAME)
            .dateOfPosting(DEFAULT_DATE_OF_POSTING)
            .description(DEFAULT_DESCRIPTION)
            .employmentType(DEFAULT_EMPLOYMENT_TYPE)
            .location(DEFAULT_LOCATION)
            .video(DEFAULT_VIDEO)
            .videoContentType(DEFAULT_VIDEO_CONTENT_TYPE)
            .status(DEFAULT_STATUS)
            .isOpen(DEFAULT_IS_OPEN);
        return vacancy;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vacancy createUpdatedEntity(EntityManager em) {
        Vacancy vacancy = new Vacancy()
            .name(UPDATED_NAME)
            .dateOfPosting(UPDATED_DATE_OF_POSTING)
            .description(UPDATED_DESCRIPTION)
            .employmentType(UPDATED_EMPLOYMENT_TYPE)
            .location(UPDATED_LOCATION)
            .video(UPDATED_VIDEO)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .status(UPDATED_STATUS)
            .isOpen(UPDATED_IS_OPEN);
        return vacancy;
    }

    @BeforeEach
    public void initTest() {
        vacancy = createEntity(em);
    }

    @Test
    @Transactional
    void createVacancy() throws Exception {
        int databaseSizeBeforeCreate = vacancyRepository.findAll().size();
        // Create the Vacancy
        restVacancyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacancy)))
            .andExpect(status().isCreated());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeCreate + 1);
        Vacancy testVacancy = vacancyList.get(vacancyList.size() - 1);
        assertThat(testVacancy.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testVacancy.getDateOfPosting()).isEqualTo(DEFAULT_DATE_OF_POSTING);
        assertThat(testVacancy.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVacancy.getEmploymentType()).isEqualTo(DEFAULT_EMPLOYMENT_TYPE);
        assertThat(testVacancy.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testVacancy.getVideo()).isEqualTo(DEFAULT_VIDEO);
        assertThat(testVacancy.getVideoContentType()).isEqualTo(DEFAULT_VIDEO_CONTENT_TYPE);
        assertThat(testVacancy.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testVacancy.getIsOpen()).isEqualTo(DEFAULT_IS_OPEN);
    }

    @Test
    @Transactional
    void createVacancyWithExistingId() throws Exception {
        // Create the Vacancy with an existing ID
        vacancy.setId(1L);

        int databaseSizeBeforeCreate = vacancyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVacancyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacancy)))
            .andExpect(status().isBadRequest());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVacancies() throws Exception {
        // Initialize the database
        vacancyRepository.saveAndFlush(vacancy);

        // Get all the vacancyList
        restVacancyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vacancy.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].dateOfPosting").value(hasItem(DEFAULT_DATE_OF_POSTING.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].employmentType").value(hasItem(DEFAULT_EMPLOYMENT_TYPE)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].videoContentType").value(hasItem(DEFAULT_VIDEO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].video").value(hasItem(Base64Utils.encodeToString(DEFAULT_VIDEO))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].isOpen").value(hasItem(DEFAULT_IS_OPEN.booleanValue())));
    }

    @Test
    @Transactional
    void getVacancy() throws Exception {
        // Initialize the database
        vacancyRepository.saveAndFlush(vacancy);

        // Get the vacancy
        restVacancyMockMvc
            .perform(get(ENTITY_API_URL_ID, vacancy.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vacancy.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.dateOfPosting").value(DEFAULT_DATE_OF_POSTING.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.employmentType").value(DEFAULT_EMPLOYMENT_TYPE))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.videoContentType").value(DEFAULT_VIDEO_CONTENT_TYPE))
            .andExpect(jsonPath("$.video").value(Base64Utils.encodeToString(DEFAULT_VIDEO)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.isOpen").value(DEFAULT_IS_OPEN.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingVacancy() throws Exception {
        // Get the vacancy
        restVacancyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVacancy() throws Exception {
        // Initialize the database
        vacancyRepository.saveAndFlush(vacancy);

        int databaseSizeBeforeUpdate = vacancyRepository.findAll().size();

        // Update the vacancy
        Vacancy updatedVacancy = vacancyRepository.findById(vacancy.getId()).get();
        // Disconnect from session so that the updates on updatedVacancy are not directly saved in db
        em.detach(updatedVacancy);
        updatedVacancy
            .name(UPDATED_NAME)
            .dateOfPosting(UPDATED_DATE_OF_POSTING)
            .description(UPDATED_DESCRIPTION)
            .employmentType(UPDATED_EMPLOYMENT_TYPE)
            .location(UPDATED_LOCATION)
            .video(UPDATED_VIDEO)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .status(UPDATED_STATUS)
            .isOpen(UPDATED_IS_OPEN);

        restVacancyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVacancy.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVacancy))
            )
            .andExpect(status().isOk());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeUpdate);
        Vacancy testVacancy = vacancyList.get(vacancyList.size() - 1);
        assertThat(testVacancy.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVacancy.getDateOfPosting()).isEqualTo(UPDATED_DATE_OF_POSTING);
        assertThat(testVacancy.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVacancy.getEmploymentType()).isEqualTo(UPDATED_EMPLOYMENT_TYPE);
        assertThat(testVacancy.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testVacancy.getVideo()).isEqualTo(UPDATED_VIDEO);
        assertThat(testVacancy.getVideoContentType()).isEqualTo(UPDATED_VIDEO_CONTENT_TYPE);
        assertThat(testVacancy.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testVacancy.getIsOpen()).isEqualTo(UPDATED_IS_OPEN);
    }

    @Test
    @Transactional
    void putNonExistingVacancy() throws Exception {
        int databaseSizeBeforeUpdate = vacancyRepository.findAll().size();
        vacancy.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacancyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vacancy.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacancy))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVacancy() throws Exception {
        int databaseSizeBeforeUpdate = vacancyRepository.findAll().size();
        vacancy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacancyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacancy))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVacancy() throws Exception {
        int databaseSizeBeforeUpdate = vacancyRepository.findAll().size();
        vacancy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacancyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacancy)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVacancyWithPatch() throws Exception {
        // Initialize the database
        vacancyRepository.saveAndFlush(vacancy);

        int databaseSizeBeforeUpdate = vacancyRepository.findAll().size();

        // Update the vacancy using partial update
        Vacancy partialUpdatedVacancy = new Vacancy();
        partialUpdatedVacancy.setId(vacancy.getId());

        partialUpdatedVacancy.employmentType(UPDATED_EMPLOYMENT_TYPE).isOpen(UPDATED_IS_OPEN);

        restVacancyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacancy.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacancy))
            )
            .andExpect(status().isOk());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeUpdate);
        Vacancy testVacancy = vacancyList.get(vacancyList.size() - 1);
        assertThat(testVacancy.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testVacancy.getDateOfPosting()).isEqualTo(DEFAULT_DATE_OF_POSTING);
        assertThat(testVacancy.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVacancy.getEmploymentType()).isEqualTo(UPDATED_EMPLOYMENT_TYPE);
        assertThat(testVacancy.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testVacancy.getVideo()).isEqualTo(DEFAULT_VIDEO);
        assertThat(testVacancy.getVideoContentType()).isEqualTo(DEFAULT_VIDEO_CONTENT_TYPE);
        assertThat(testVacancy.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testVacancy.getIsOpen()).isEqualTo(UPDATED_IS_OPEN);
    }

    @Test
    @Transactional
    void fullUpdateVacancyWithPatch() throws Exception {
        // Initialize the database
        vacancyRepository.saveAndFlush(vacancy);

        int databaseSizeBeforeUpdate = vacancyRepository.findAll().size();

        // Update the vacancy using partial update
        Vacancy partialUpdatedVacancy = new Vacancy();
        partialUpdatedVacancy.setId(vacancy.getId());

        partialUpdatedVacancy
            .name(UPDATED_NAME)
            .dateOfPosting(UPDATED_DATE_OF_POSTING)
            .description(UPDATED_DESCRIPTION)
            .employmentType(UPDATED_EMPLOYMENT_TYPE)
            .location(UPDATED_LOCATION)
            .video(UPDATED_VIDEO)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .status(UPDATED_STATUS)
            .isOpen(UPDATED_IS_OPEN);

        restVacancyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacancy.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacancy))
            )
            .andExpect(status().isOk());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeUpdate);
        Vacancy testVacancy = vacancyList.get(vacancyList.size() - 1);
        assertThat(testVacancy.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVacancy.getDateOfPosting()).isEqualTo(UPDATED_DATE_OF_POSTING);
        assertThat(testVacancy.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVacancy.getEmploymentType()).isEqualTo(UPDATED_EMPLOYMENT_TYPE);
        assertThat(testVacancy.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testVacancy.getVideo()).isEqualTo(UPDATED_VIDEO);
        assertThat(testVacancy.getVideoContentType()).isEqualTo(UPDATED_VIDEO_CONTENT_TYPE);
        assertThat(testVacancy.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testVacancy.getIsOpen()).isEqualTo(UPDATED_IS_OPEN);
    }

    @Test
    @Transactional
    void patchNonExistingVacancy() throws Exception {
        int databaseSizeBeforeUpdate = vacancyRepository.findAll().size();
        vacancy.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacancyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vacancy.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacancy))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVacancy() throws Exception {
        int databaseSizeBeforeUpdate = vacancyRepository.findAll().size();
        vacancy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacancyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacancy))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVacancy() throws Exception {
        int databaseSizeBeforeUpdate = vacancyRepository.findAll().size();
        vacancy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacancyMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(vacancy)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vacancy in the database
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVacancy() throws Exception {
        // Initialize the database
        vacancyRepository.saveAndFlush(vacancy);

        int databaseSizeBeforeDelete = vacancyRepository.findAll().size();

        // Delete the vacancy
        restVacancyMockMvc
            .perform(delete(ENTITY_API_URL_ID, vacancy.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vacancy> vacancyList = vacancyRepository.findAll();
        assertThat(vacancyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
