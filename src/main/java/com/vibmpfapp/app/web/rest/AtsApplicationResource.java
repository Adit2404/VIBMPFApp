package com.vibmpfapp.app.web.rest;

import com.vibmpfapp.app.domain.AtsApplication;
import com.vibmpfapp.app.repository.AtsApplicationRepository;
import com.vibmpfapp.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.vibmpfapp.app.domain.AtsApplication}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AtsApplicationResource {

    private final Logger log = LoggerFactory.getLogger(AtsApplicationResource.class);

    private static final String ENTITY_NAME = "atsApplication";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AtsApplicationRepository atsApplicationRepository;

    public AtsApplicationResource(AtsApplicationRepository atsApplicationRepository) {
        this.atsApplicationRepository = atsApplicationRepository;
    }

    /**
     * {@code POST  /ats-applications} : Create a new atsApplication.
     *
     * @param atsApplication the atsApplication to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new atsApplication, or with status {@code 400 (Bad Request)} if the atsApplication has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ats-applications")
    public ResponseEntity<AtsApplication> createAtsApplication(@RequestBody AtsApplication atsApplication) throws URISyntaxException {
        log.debug("REST request to save AtsApplication : {}", atsApplication);
        if (atsApplication.getId() != null) {
            throw new BadRequestAlertException("A new atsApplication cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AtsApplication result = atsApplicationRepository.save(atsApplication);
        return ResponseEntity
            .created(new URI("/api/ats-applications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ats-applications/:id} : Updates an existing atsApplication.
     *
     * @param id the id of the atsApplication to save.
     * @param atsApplication the atsApplication to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated atsApplication,
     * or with status {@code 400 (Bad Request)} if the atsApplication is not valid,
     * or with status {@code 500 (Internal Server Error)} if the atsApplication couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ats-applications/{id}")
    public ResponseEntity<AtsApplication> updateAtsApplication(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AtsApplication atsApplication
    ) throws URISyntaxException {
        log.debug("REST request to update AtsApplication : {}, {}", id, atsApplication);
        if (atsApplication.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, atsApplication.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!atsApplicationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AtsApplication result = atsApplicationRepository.save(atsApplication);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, atsApplication.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ats-applications/:id} : Partial updates given fields of an existing atsApplication, field will ignore if it is null
     *
     * @param id the id of the atsApplication to save.
     * @param atsApplication the atsApplication to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated atsApplication,
     * or with status {@code 400 (Bad Request)} if the atsApplication is not valid,
     * or with status {@code 404 (Not Found)} if the atsApplication is not found,
     * or with status {@code 500 (Internal Server Error)} if the atsApplication couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ats-applications/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AtsApplication> partialUpdateAtsApplication(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AtsApplication atsApplication
    ) throws URISyntaxException {
        log.debug("REST request to partial update AtsApplication partially : {}, {}", id, atsApplication);
        if (atsApplication.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, atsApplication.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!atsApplicationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AtsApplication> result = atsApplicationRepository
            .findById(atsApplication.getId())
            .map(existingAtsApplication -> {
                if (atsApplication.getDate() != null) {
                    existingAtsApplication.setDate(atsApplication.getDate());
                }

                return existingAtsApplication;
            })
            .map(atsApplicationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, atsApplication.getId().toString())
        );
    }

    /**
     * {@code GET  /ats-applications} : get all the atsApplications.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of atsApplications in body.
     */
    @GetMapping("/ats-applications")
    public List<AtsApplication> getAllAtsApplications() {
        log.debug("REST request to get all AtsApplications");
        return atsApplicationRepository.findAll();
    }

    /**
     * {@code GET  /ats-applications/:id} : get the "id" atsApplication.
     *
     * @param id the id of the atsApplication to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the atsApplication, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ats-applications/{id}")
    public ResponseEntity<AtsApplication> getAtsApplication(@PathVariable Long id) {
        log.debug("REST request to get AtsApplication : {}", id);
        Optional<AtsApplication> atsApplication = atsApplicationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(atsApplication);
    }

    /**
     * {@code DELETE  /ats-applications/:id} : delete the "id" atsApplication.
     *
     * @param id the id of the atsApplication to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ats-applications/{id}")
    public ResponseEntity<Void> deleteAtsApplication(@PathVariable Long id) {
        log.debug("REST request to delete AtsApplication : {}", id);
        atsApplicationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
