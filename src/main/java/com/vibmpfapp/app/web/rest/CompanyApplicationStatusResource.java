package com.vibmpfapp.app.web.rest;

import com.vibmpfapp.app.domain.CompanyApplicationStatus;
import com.vibmpfapp.app.repository.CompanyApplicationStatusRepository;
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
 * REST controller for managing {@link com.vibmpfapp.app.domain.CompanyApplicationStatus}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompanyApplicationStatusResource {

    private final Logger log = LoggerFactory.getLogger(CompanyApplicationStatusResource.class);

    private static final String ENTITY_NAME = "companyApplicationStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompanyApplicationStatusRepository companyApplicationStatusRepository;

    public CompanyApplicationStatusResource(CompanyApplicationStatusRepository companyApplicationStatusRepository) {
        this.companyApplicationStatusRepository = companyApplicationStatusRepository;
    }

    /**
     * {@code POST  /company-application-statuses} : Create a new companyApplicationStatus.
     *
     * @param companyApplicationStatus the companyApplicationStatus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new companyApplicationStatus, or with status {@code 400 (Bad Request)} if the companyApplicationStatus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/company-application-statuses")
    public ResponseEntity<CompanyApplicationStatus> createCompanyApplicationStatus(
        @RequestBody CompanyApplicationStatus companyApplicationStatus
    ) throws URISyntaxException {
        log.debug("REST request to save CompanyApplicationStatus : {}", companyApplicationStatus);
        if (companyApplicationStatus.getId() != null) {
            throw new BadRequestAlertException("A new companyApplicationStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompanyApplicationStatus result = companyApplicationStatusRepository.save(companyApplicationStatus);
        return ResponseEntity
            .created(new URI("/api/company-application-statuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /company-application-statuses/:id} : Updates an existing companyApplicationStatus.
     *
     * @param id the id of the companyApplicationStatus to save.
     * @param companyApplicationStatus the companyApplicationStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyApplicationStatus,
     * or with status {@code 400 (Bad Request)} if the companyApplicationStatus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the companyApplicationStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/company-application-statuses/{id}")
    public ResponseEntity<CompanyApplicationStatus> updateCompanyApplicationStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompanyApplicationStatus companyApplicationStatus
    ) throws URISyntaxException {
        log.debug("REST request to update CompanyApplicationStatus : {}, {}", id, companyApplicationStatus);
        if (companyApplicationStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, companyApplicationStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyApplicationStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompanyApplicationStatus result = companyApplicationStatusRepository.save(companyApplicationStatus);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, companyApplicationStatus.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /company-application-statuses/:id} : Partial updates given fields of an existing companyApplicationStatus, field will ignore if it is null
     *
     * @param id the id of the companyApplicationStatus to save.
     * @param companyApplicationStatus the companyApplicationStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyApplicationStatus,
     * or with status {@code 400 (Bad Request)} if the companyApplicationStatus is not valid,
     * or with status {@code 404 (Not Found)} if the companyApplicationStatus is not found,
     * or with status {@code 500 (Internal Server Error)} if the companyApplicationStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/company-application-statuses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompanyApplicationStatus> partialUpdateCompanyApplicationStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompanyApplicationStatus companyApplicationStatus
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompanyApplicationStatus partially : {}, {}", id, companyApplicationStatus);
        if (companyApplicationStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, companyApplicationStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyApplicationStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompanyApplicationStatus> result = companyApplicationStatusRepository
            .findById(companyApplicationStatus.getId())
            .map(existingCompanyApplicationStatus -> {
                if (companyApplicationStatus.getName() != null) {
                    existingCompanyApplicationStatus.setName(companyApplicationStatus.getName());
                }

                return existingCompanyApplicationStatus;
            })
            .map(companyApplicationStatusRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, companyApplicationStatus.getId().toString())
        );
    }

    /**
     * {@code GET  /company-application-statuses} : get all the companyApplicationStatuses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of companyApplicationStatuses in body.
     */
    @GetMapping("/company-application-statuses")
    public List<CompanyApplicationStatus> getAllCompanyApplicationStatuses() {
        log.debug("REST request to get all CompanyApplicationStatuses");
        return companyApplicationStatusRepository.findAll();
    }

    /**
     * {@code GET  /company-application-statuses/:id} : get the "id" companyApplicationStatus.
     *
     * @param id the id of the companyApplicationStatus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the companyApplicationStatus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/company-application-statuses/{id}")
    public ResponseEntity<CompanyApplicationStatus> getCompanyApplicationStatus(@PathVariable Long id) {
        log.debug("REST request to get CompanyApplicationStatus : {}", id);
        Optional<CompanyApplicationStatus> companyApplicationStatus = companyApplicationStatusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(companyApplicationStatus);
    }

    /**
     * {@code DELETE  /company-application-statuses/:id} : delete the "id" companyApplicationStatus.
     *
     * @param id the id of the companyApplicationStatus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/company-application-statuses/{id}")
    public ResponseEntity<Void> deleteCompanyApplicationStatus(@PathVariable Long id) {
        log.debug("REST request to delete CompanyApplicationStatus : {}", id);
        companyApplicationStatusRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
