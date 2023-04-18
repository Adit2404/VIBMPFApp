package com.vibmpfapp.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.vibmpfapp.app.IntegrationTest;
import com.vibmpfapp.app.domain.AtsUser;
import com.vibmpfapp.app.repository.AtsUserRepository;
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
 * Integration tests for the {@link AtsUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AtsUserResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final byte[] DEFAULT_VIDEO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_VIDEO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_VIDEO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_VIDEO_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_CV = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CV = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CV_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CV_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    private static final String DEFAULT_USERTYPE = "AAAAAAAAAA";
    private static final String UPDATED_USERTYPE = "BBBBBBBBBB";

    private static final String DEFAULT_STREET_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_STREET_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_POSTAL_CODE = "AAAAAAAAAA";
    private static final String UPDATED_POSTAL_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_STATE_PROVINCE = "AAAAAAAAAA";
    private static final String UPDATED_STATE_PROVINCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ats-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AtsUserRepository atsUserRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAtsUserMockMvc;

    private AtsUser atsUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AtsUser createEntity(EntityManager em) {
        AtsUser atsUser = new AtsUser()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .userId(DEFAULT_USER_ID)
            .video(DEFAULT_VIDEO)
            .videoContentType(DEFAULT_VIDEO_CONTENT_TYPE)
            .cv(DEFAULT_CV)
            .cvContentType(DEFAULT_CV_CONTENT_TYPE)
            .password(DEFAULT_PASSWORD)
            .usertype(DEFAULT_USERTYPE)
            .streetAddress(DEFAULT_STREET_ADDRESS)
            .postalCode(DEFAULT_POSTAL_CODE)
            .city(DEFAULT_CITY)
            .stateProvince(DEFAULT_STATE_PROVINCE);
        return atsUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AtsUser createUpdatedEntity(EntityManager em) {
        AtsUser atsUser = new AtsUser()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .userId(UPDATED_USER_ID)
            .video(UPDATED_VIDEO)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .cv(UPDATED_CV)
            .cvContentType(UPDATED_CV_CONTENT_TYPE)
            .password(UPDATED_PASSWORD)
            .usertype(UPDATED_USERTYPE)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);
        return atsUser;
    }

    @BeforeEach
    public void initTest() {
        atsUser = createEntity(em);
    }

    @Test
    @Transactional
    void createAtsUser() throws Exception {
        int databaseSizeBeforeCreate = atsUserRepository.findAll().size();
        // Create the AtsUser
        restAtsUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atsUser)))
            .andExpect(status().isCreated());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeCreate + 1);
        AtsUser testAtsUser = atsUserList.get(atsUserList.size() - 1);
        assertThat(testAtsUser.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testAtsUser.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testAtsUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testAtsUser.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testAtsUser.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testAtsUser.getVideo()).isEqualTo(DEFAULT_VIDEO);
        assertThat(testAtsUser.getVideoContentType()).isEqualTo(DEFAULT_VIDEO_CONTENT_TYPE);
        assertThat(testAtsUser.getCv()).isEqualTo(DEFAULT_CV);
        assertThat(testAtsUser.getCvContentType()).isEqualTo(DEFAULT_CV_CONTENT_TYPE);
        assertThat(testAtsUser.getPassword()).isEqualTo(DEFAULT_PASSWORD);
        assertThat(testAtsUser.getUsertype()).isEqualTo(DEFAULT_USERTYPE);
        assertThat(testAtsUser.getStreetAddress()).isEqualTo(DEFAULT_STREET_ADDRESS);
        assertThat(testAtsUser.getPostalCode()).isEqualTo(DEFAULT_POSTAL_CODE);
        assertThat(testAtsUser.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testAtsUser.getStateProvince()).isEqualTo(DEFAULT_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void createAtsUserWithExistingId() throws Exception {
        // Create the AtsUser with an existing ID
        atsUser.setId(1L);

        int databaseSizeBeforeCreate = atsUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAtsUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atsUser)))
            .andExpect(status().isBadRequest());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAtsUsers() throws Exception {
        // Initialize the database
        atsUserRepository.saveAndFlush(atsUser);

        // Get all the atsUserList
        restAtsUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(atsUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].videoContentType").value(hasItem(DEFAULT_VIDEO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].video").value(hasItem(Base64Utils.encodeToString(DEFAULT_VIDEO))))
            .andExpect(jsonPath("$.[*].cvContentType").value(hasItem(DEFAULT_CV_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].cv").value(hasItem(Base64Utils.encodeToString(DEFAULT_CV))))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)))
            .andExpect(jsonPath("$.[*].usertype").value(hasItem(DEFAULT_USERTYPE)))
            .andExpect(jsonPath("$.[*].streetAddress").value(hasItem(DEFAULT_STREET_ADDRESS)))
            .andExpect(jsonPath("$.[*].postalCode").value(hasItem(DEFAULT_POSTAL_CODE)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].stateProvince").value(hasItem(DEFAULT_STATE_PROVINCE)));
    }

    @Test
    @Transactional
    void getAtsUser() throws Exception {
        // Initialize the database
        atsUserRepository.saveAndFlush(atsUser);

        // Get the atsUser
        restAtsUserMockMvc
            .perform(get(ENTITY_API_URL_ID, atsUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(atsUser.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.videoContentType").value(DEFAULT_VIDEO_CONTENT_TYPE))
            .andExpect(jsonPath("$.video").value(Base64Utils.encodeToString(DEFAULT_VIDEO)))
            .andExpect(jsonPath("$.cvContentType").value(DEFAULT_CV_CONTENT_TYPE))
            .andExpect(jsonPath("$.cv").value(Base64Utils.encodeToString(DEFAULT_CV)))
            .andExpect(jsonPath("$.password").value(DEFAULT_PASSWORD))
            .andExpect(jsonPath("$.usertype").value(DEFAULT_USERTYPE))
            .andExpect(jsonPath("$.streetAddress").value(DEFAULT_STREET_ADDRESS))
            .andExpect(jsonPath("$.postalCode").value(DEFAULT_POSTAL_CODE))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.stateProvince").value(DEFAULT_STATE_PROVINCE));
    }

    @Test
    @Transactional
    void getNonExistingAtsUser() throws Exception {
        // Get the atsUser
        restAtsUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAtsUser() throws Exception {
        // Initialize the database
        atsUserRepository.saveAndFlush(atsUser);

        int databaseSizeBeforeUpdate = atsUserRepository.findAll().size();

        // Update the atsUser
        AtsUser updatedAtsUser = atsUserRepository.findById(atsUser.getId()).get();
        // Disconnect from session so that the updates on updatedAtsUser are not directly saved in db
        em.detach(updatedAtsUser);
        updatedAtsUser
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .userId(UPDATED_USER_ID)
            .video(UPDATED_VIDEO)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .cv(UPDATED_CV)
            .cvContentType(UPDATED_CV_CONTENT_TYPE)
            .password(UPDATED_PASSWORD)
            .usertype(UPDATED_USERTYPE)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);

        restAtsUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAtsUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAtsUser))
            )
            .andExpect(status().isOk());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeUpdate);
        AtsUser testAtsUser = atsUserList.get(atsUserList.size() - 1);
        assertThat(testAtsUser.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testAtsUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testAtsUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAtsUser.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testAtsUser.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testAtsUser.getVideo()).isEqualTo(UPDATED_VIDEO);
        assertThat(testAtsUser.getVideoContentType()).isEqualTo(UPDATED_VIDEO_CONTENT_TYPE);
        assertThat(testAtsUser.getCv()).isEqualTo(UPDATED_CV);
        assertThat(testAtsUser.getCvContentType()).isEqualTo(UPDATED_CV_CONTENT_TYPE);
        assertThat(testAtsUser.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testAtsUser.getUsertype()).isEqualTo(UPDATED_USERTYPE);
        assertThat(testAtsUser.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testAtsUser.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testAtsUser.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testAtsUser.getStateProvince()).isEqualTo(UPDATED_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void putNonExistingAtsUser() throws Exception {
        int databaseSizeBeforeUpdate = atsUserRepository.findAll().size();
        atsUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAtsUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, atsUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(atsUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAtsUser() throws Exception {
        int databaseSizeBeforeUpdate = atsUserRepository.findAll().size();
        atsUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtsUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(atsUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAtsUser() throws Exception {
        int databaseSizeBeforeUpdate = atsUserRepository.findAll().size();
        atsUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtsUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atsUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAtsUserWithPatch() throws Exception {
        // Initialize the database
        atsUserRepository.saveAndFlush(atsUser);

        int databaseSizeBeforeUpdate = atsUserRepository.findAll().size();

        // Update the atsUser using partial update
        AtsUser partialUpdatedAtsUser = new AtsUser();
        partialUpdatedAtsUser.setId(atsUser.getId());

        partialUpdatedAtsUser
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .userId(UPDATED_USER_ID)
            .video(UPDATED_VIDEO)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .usertype(UPDATED_USERTYPE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);

        restAtsUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAtsUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAtsUser))
            )
            .andExpect(status().isOk());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeUpdate);
        AtsUser testAtsUser = atsUserList.get(atsUserList.size() - 1);
        assertThat(testAtsUser.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testAtsUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testAtsUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAtsUser.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testAtsUser.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testAtsUser.getVideo()).isEqualTo(UPDATED_VIDEO);
        assertThat(testAtsUser.getVideoContentType()).isEqualTo(UPDATED_VIDEO_CONTENT_TYPE);
        assertThat(testAtsUser.getCv()).isEqualTo(DEFAULT_CV);
        assertThat(testAtsUser.getCvContentType()).isEqualTo(DEFAULT_CV_CONTENT_TYPE);
        assertThat(testAtsUser.getPassword()).isEqualTo(DEFAULT_PASSWORD);
        assertThat(testAtsUser.getUsertype()).isEqualTo(UPDATED_USERTYPE);
        assertThat(testAtsUser.getStreetAddress()).isEqualTo(DEFAULT_STREET_ADDRESS);
        assertThat(testAtsUser.getPostalCode()).isEqualTo(DEFAULT_POSTAL_CODE);
        assertThat(testAtsUser.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testAtsUser.getStateProvince()).isEqualTo(UPDATED_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void fullUpdateAtsUserWithPatch() throws Exception {
        // Initialize the database
        atsUserRepository.saveAndFlush(atsUser);

        int databaseSizeBeforeUpdate = atsUserRepository.findAll().size();

        // Update the atsUser using partial update
        AtsUser partialUpdatedAtsUser = new AtsUser();
        partialUpdatedAtsUser.setId(atsUser.getId());

        partialUpdatedAtsUser
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .userId(UPDATED_USER_ID)
            .video(UPDATED_VIDEO)
            .videoContentType(UPDATED_VIDEO_CONTENT_TYPE)
            .cv(UPDATED_CV)
            .cvContentType(UPDATED_CV_CONTENT_TYPE)
            .password(UPDATED_PASSWORD)
            .usertype(UPDATED_USERTYPE)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);

        restAtsUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAtsUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAtsUser))
            )
            .andExpect(status().isOk());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeUpdate);
        AtsUser testAtsUser = atsUserList.get(atsUserList.size() - 1);
        assertThat(testAtsUser.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testAtsUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testAtsUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAtsUser.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testAtsUser.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testAtsUser.getVideo()).isEqualTo(UPDATED_VIDEO);
        assertThat(testAtsUser.getVideoContentType()).isEqualTo(UPDATED_VIDEO_CONTENT_TYPE);
        assertThat(testAtsUser.getCv()).isEqualTo(UPDATED_CV);
        assertThat(testAtsUser.getCvContentType()).isEqualTo(UPDATED_CV_CONTENT_TYPE);
        assertThat(testAtsUser.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testAtsUser.getUsertype()).isEqualTo(UPDATED_USERTYPE);
        assertThat(testAtsUser.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testAtsUser.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testAtsUser.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testAtsUser.getStateProvince()).isEqualTo(UPDATED_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void patchNonExistingAtsUser() throws Exception {
        int databaseSizeBeforeUpdate = atsUserRepository.findAll().size();
        atsUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAtsUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, atsUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(atsUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAtsUser() throws Exception {
        int databaseSizeBeforeUpdate = atsUserRepository.findAll().size();
        atsUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtsUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(atsUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAtsUser() throws Exception {
        int databaseSizeBeforeUpdate = atsUserRepository.findAll().size();
        atsUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtsUserMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(atsUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AtsUser in the database
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAtsUser() throws Exception {
        // Initialize the database
        atsUserRepository.saveAndFlush(atsUser);

        int databaseSizeBeforeDelete = atsUserRepository.findAll().size();

        // Delete the atsUser
        restAtsUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, atsUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AtsUser> atsUserList = atsUserRepository.findAll();
        assertThat(atsUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
