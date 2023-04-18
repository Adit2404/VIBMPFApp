package com.vibmpfapp.app.web.rest;

import com.vibmpfapp.app.domain.Vacancy;
import com.vibmpfapp.app.repository.VacancyRepository;
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
 * REST controller for managing {@link com.vibmpfapp.app.domain.Vacancy}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VacancyResource {

    private final Logger log = LoggerFactory.getLogger(VacancyResource.class);

    private static final String ENTITY_NAME = "vacancy";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VacancyRepository vacancyRepository;

    public VacancyResource(VacancyRepository vacancyRepository) {
        this.vacancyRepository = vacancyRepository;
    }

    /**
     * {@code POST  /vacancies} : Create a new vacancy.
     *
     * @param vacancy the vacancy to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vacancy, or with status {@code 400 (Bad Request)} if the vacancy has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vacancies")
    public ResponseEntity<Vacancy> createVacancy(@RequestBody Vacancy vacancy) throws URISyntaxException {
        log.debug("REST request to save Vacancy : {}", vacancy);
        if (vacancy.getId() != null) {
            throw new BadRequestAlertException("A new vacancy cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vacancy result = vacancyRepository.save(vacancy);
        return ResponseEntity
            .created(new URI("/api/vacancies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vacancies/:id} : Updates an existing vacancy.
     *
     * @param id the id of the vacancy to save.
     * @param vacancy the vacancy to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacancy,
     * or with status {@code 400 (Bad Request)} if the vacancy is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vacancy couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vacancies/{id}")
    public ResponseEntity<Vacancy> updateVacancy(@PathVariable(value = "id", required = false) final Long id, @RequestBody Vacancy vacancy)
        throws URISyntaxException {
        log.debug("REST request to update Vacancy : {}, {}", id, vacancy);
        if (vacancy.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacancy.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacancyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vacancy result = vacancyRepository.save(vacancy);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vacancy.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vacancies/:id} : Partial updates given fields of an existing vacancy, field will ignore if it is null
     *
     * @param id the id of the vacancy to save.
     * @param vacancy the vacancy to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacancy,
     * or with status {@code 400 (Bad Request)} if the vacancy is not valid,
     * or with status {@code 404 (Not Found)} if the vacancy is not found,
     * or with status {@code 500 (Internal Server Error)} if the vacancy couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vacancies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Vacancy> partialUpdateVacancy(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Vacancy vacancy
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vacancy partially : {}, {}", id, vacancy);
        if (vacancy.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacancy.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacancyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vacancy> result = vacancyRepository
            .findById(vacancy.getId())
            .map(existingVacancy -> {
                if (vacancy.getName() != null) {
                    existingVacancy.setName(vacancy.getName());
                }
                if (vacancy.getDateOfPosting() != null) {
                    existingVacancy.setDateOfPosting(vacancy.getDateOfPosting());
                }
                if (vacancy.getDescription() != null) {
                    existingVacancy.setDescription(vacancy.getDescription());
                }
                if (vacancy.getEmploymentType() != null) {
                    existingVacancy.setEmploymentType(vacancy.getEmploymentType());
                }
                if (vacancy.getLocation() != null) {
                    existingVacancy.setLocation(vacancy.getLocation());
                }
                if (vacancy.getVideo() != null) {
                    existingVacancy.setVideo(vacancy.getVideo());
                }
                if (vacancy.getVideoContentType() != null) {
                    existingVacancy.setVideoContentType(vacancy.getVideoContentType());
                }
                if (vacancy.getStatus() != null) {
                    existingVacancy.setStatus(vacancy.getStatus());
                }
                if (vacancy.getIsOpen() != null) {
                    existingVacancy.setIsOpen(vacancy.getIsOpen());
                }

                return existingVacancy;
            })
            .map(vacancyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vacancy.getId().toString())
        );
    }

    /**
     * {@code GET  /vacancies} : get all the vacancies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vacancies in body.
     */
    @GetMapping("/vacancies")
    public List<Vacancy> getAllVacancies() {
        log.debug("REST request to get all Vacancies");
        return vacancyRepository.findAll();
    }

    /**
     * {@code GET  /vacancies/:id} : get the "id" vacancy.
     *
     * @param id the id of the vacancy to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vacancy, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vacancies/{id}")
    public ResponseEntity<Vacancy> getVacancy(@PathVariable Long id) {
        log.debug("REST request to get Vacancy : {}", id);
        Optional<Vacancy> vacancy = vacancyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(vacancy);
    }

    /**
     * {@code DELETE  /vacancies/:id} : delete the "id" vacancy.
     *
     * @param id the id of the vacancy to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vacancies/{id}")
    public ResponseEntity<Void> deleteVacancy(@PathVariable Long id) {
        log.debug("REST request to delete Vacancy : {}", id);
        vacancyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
