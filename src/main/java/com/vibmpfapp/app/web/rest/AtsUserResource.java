package com.vibmpfapp.app.web.rest;

import com.vibmpfapp.app.domain.AtsUser;
import com.vibmpfapp.app.repository.AtsUserRepository;
import com.vibmpfapp.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.vibmpfapp.app.domain.AtsUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AtsUserResource {

    private final Logger log = LoggerFactory.getLogger(AtsUserResource.class);

    private static final String ENTITY_NAME = "atsUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AtsUserRepository atsUserRepository;

    public AtsUserResource(AtsUserRepository atsUserRepository) {
        this.atsUserRepository = atsUserRepository;
    }

    /**
     * {@code POST  /ats-users} : Create a new atsUser.
     *
     * @param atsUser the atsUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new atsUser, or with status {@code 400 (Bad Request)} if the atsUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ats-users")
    public ResponseEntity<AtsUser> createAtsUser(@RequestBody AtsUser atsUser) throws URISyntaxException {
        log.debug("REST request to save AtsUser : {}", atsUser);
        if (atsUser.getId() != null) {
            throw new BadRequestAlertException("A new atsUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AtsUser result = atsUserRepository.save(atsUser);
        return ResponseEntity
            .created(new URI("/api/ats-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ats-users/:id} : Updates an existing atsUser.
     *
     * @param id the id of the atsUser to save.
     * @param atsUser the atsUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated atsUser,
     * or with status {@code 400 (Bad Request)} if the atsUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the atsUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ats-users/{id}")
    public ResponseEntity<AtsUser> updateAtsUser(@PathVariable(value = "id", required = false) final Long id, @RequestBody AtsUser atsUser)
        throws URISyntaxException {
        log.debug("REST request to update AtsUser : {}, {}", id, atsUser);
        if (atsUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, atsUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!atsUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AtsUser result = atsUserRepository.save(atsUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, atsUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ats-users/:id} : Partial updates given fields of an existing atsUser, field will ignore if it is null
     *
     * @param id the id of the atsUser to save.
     * @param atsUser the atsUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated atsUser,
     * or with status {@code 400 (Bad Request)} if the atsUser is not valid,
     * or with status {@code 404 (Not Found)} if the atsUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the atsUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ats-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AtsUser> partialUpdateAtsUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AtsUser atsUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update AtsUser partially : {}, {}", id, atsUser);
        if (atsUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, atsUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!atsUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AtsUser> result = atsUserRepository
            .findById(atsUser.getId())
            .map(existingAtsUser -> {
                if (atsUser.getFirstName() != null) {
                    existingAtsUser.setFirstName(atsUser.getFirstName());
                }
                if (atsUser.getLastName() != null) {
                    existingAtsUser.setLastName(atsUser.getLastName());
                }
                if (atsUser.getEmail() != null) {
                    existingAtsUser.setEmail(atsUser.getEmail());
                }
                if (atsUser.getPhoneNumber() != null) {
                    existingAtsUser.setPhoneNumber(atsUser.getPhoneNumber());
                }
                if (atsUser.getUserId() != null) {
                    existingAtsUser.setUserId(atsUser.getUserId());
                }
                if (atsUser.getVideo() != null) {
                    existingAtsUser.setVideo(atsUser.getVideo());
                }
                if (atsUser.getVideoContentType() != null) {
                    existingAtsUser.setVideoContentType(atsUser.getVideoContentType());
                }
                if (atsUser.getCv() != null) {
                    existingAtsUser.setCv(atsUser.getCv());
                }
                if (atsUser.getCvContentType() != null) {
                    existingAtsUser.setCvContentType(atsUser.getCvContentType());
                }
                if (atsUser.getPassword() != null) {
                    existingAtsUser.setPassword(atsUser.getPassword());
                }
                if (atsUser.getUsertype() != null) {
                    existingAtsUser.setUsertype(atsUser.getUsertype());
                }
                if (atsUser.getStreetAddress() != null) {
                    existingAtsUser.setStreetAddress(atsUser.getStreetAddress());
                }
                if (atsUser.getPostalCode() != null) {
                    existingAtsUser.setPostalCode(atsUser.getPostalCode());
                }
                if (atsUser.getCity() != null) {
                    existingAtsUser.setCity(atsUser.getCity());
                }
                if (atsUser.getStateProvince() != null) {
                    existingAtsUser.setStateProvince(atsUser.getStateProvince());
                }

                return existingAtsUser;
            })
            .map(atsUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, atsUser.getId().toString())
        );
    }

    /**
     * {@code GET  /ats-users} : get all the atsUsers.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of atsUsers in body.
     */
    @GetMapping("/ats-users")
    public List<AtsUser> getAllAtsUsers(@RequestParam(required = false) String filter) {
        if ("candidate-is-null".equals(filter)) {
            log.debug("REST request to get all AtsUsers where candidate is null");
            return StreamSupport
                .stream(atsUserRepository.findAll().spliterator(), false)
                .filter(atsUser -> atsUser.getCandidate() == null)
                .collect(Collectors.toList());
        }

        if ("companyuser-is-null".equals(filter)) {
            log.debug("REST request to get all AtsUsers where companyUser is null");
            return StreamSupport
                .stream(atsUserRepository.findAll().spliterator(), false)
                .filter(atsUser -> atsUser.getCompanyUser() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all AtsUsers");
        return atsUserRepository.findAll();
    }

    /**
     * {@code GET  /ats-users/:id} : get the "id" atsUser.
     *
     * @param id the id of the atsUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the atsUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ats-users/{id}")
    public ResponseEntity<AtsUser> getAtsUser(@PathVariable Long id) {
        log.debug("REST request to get AtsUser : {}", id);
        Optional<AtsUser> atsUser = atsUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(atsUser);
    }

    /**
     * {@code DELETE  /ats-users/:id} : delete the "id" atsUser.
     *
     * @param id the id of the atsUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ats-users/{id}")
    public ResponseEntity<Void> deleteAtsUser(@PathVariable Long id) {
        log.debug("REST request to delete AtsUser : {}", id);
        atsUserRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
