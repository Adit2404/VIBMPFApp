package com.vibmpfapp.app.web.rest;

import com.vibmpfapp.app.domain.Education;
import com.vibmpfapp.app.repository.EducationRepository;
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
 * REST controller for managing {@link com.vibmpfapp.app.domain.Education}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EducationResource {

    private final Logger log = LoggerFactory.getLogger(EducationResource.class);

    private static final String ENTITY_NAME = "education";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EducationRepository educationRepository;

    public EducationResource(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }

    /**
     * {@code POST  /educations} : Create a new education.
     *
     * @param education the education to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new education, or with status {@code 400 (Bad Request)} if the education has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/educations")
    public ResponseEntity<Education> createEducation(@RequestBody Education education) throws URISyntaxException {
        log.debug("REST request to save Education : {}", education);
        if (education.getId() != null) {
            throw new BadRequestAlertException("A new education cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Education result = educationRepository.save(education);
        return ResponseEntity
            .created(new URI("/api/educations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /educations/:id} : Updates an existing education.
     *
     * @param id the id of the education to save.
     * @param education the education to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated education,
     * or with status {@code 400 (Bad Request)} if the education is not valid,
     * or with status {@code 500 (Internal Server Error)} if the education couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/educations/{id}")
    public ResponseEntity<Education> updateEducation(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Education education
    ) throws URISyntaxException {
        log.debug("REST request to update Education : {}, {}", id, education);
        if (education.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, education.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!educationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        education.setIsPersisted();
        Education result = educationRepository.save(education);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, education.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /educations/:id} : Partial updates given fields of an existing education, field will ignore if it is null
     *
     * @param id the id of the education to save.
     * @param education the education to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated education,
     * or with status {@code 400 (Bad Request)} if the education is not valid,
     * or with status {@code 404 (Not Found)} if the education is not found,
     * or with status {@code 500 (Internal Server Error)} if the education couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/educations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Education> partialUpdateEducation(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Education education
    ) throws URISyntaxException {
        log.debug("REST request to partial update Education partially : {}, {}", id, education);
        if (education.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, education.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!educationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Education> result = educationRepository
            .findById(education.getId())
            .map(existingEducation -> {
                if (education.getTitle() != null) {
                    existingEducation.setTitle(education.getTitle());
                }
                if (education.getCompany() != null) {
                    existingEducation.setCompany(education.getCompany());
                }
                if (education.getLocation() != null) {
                    existingEducation.setLocation(education.getLocation());
                }
                if (education.getSdate() != null) {
                    existingEducation.setSdate(education.getSdate());
                }
                if (education.getEdate() != null) {
                    existingEducation.setEdate(education.getEdate());
                }
                if (education.getDescription() != null) {
                    existingEducation.setDescription(education.getDescription());
                }

                return existingEducation;
            })
            .map(educationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, education.getId())
        );
    }

    /**
     * {@code GET  /educations} : get all the educations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of educations in body.
     */
    @GetMapping("/educations")
    public List<Education> getAllEducations() {
        log.debug("REST request to get all Educations");
        return educationRepository.findAll();
    }

    /**
     * {@code GET  /educations/:id} : get the "id" education.
     *
     * @param id the id of the education to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the education, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/educations/{id}")
    public ResponseEntity<Education> getEducation(@PathVariable String id) {
        log.debug("REST request to get Education : {}", id);
        Optional<Education> education = educationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(education);
    }

    /**
     * {@code DELETE  /educations/:id} : delete the "id" education.
     *
     * @param id the id of the education to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/educations/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable String id) {
        log.debug("REST request to delete Education : {}", id);
        educationRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
