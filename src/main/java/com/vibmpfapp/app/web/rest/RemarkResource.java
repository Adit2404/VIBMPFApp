package com.vibmpfapp.app.web.rest;

import com.vibmpfapp.app.domain.Remark;
import com.vibmpfapp.app.repository.RemarkRepository;
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
 * REST controller for managing {@link com.vibmpfapp.app.domain.Remark}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RemarkResource {

    private final Logger log = LoggerFactory.getLogger(RemarkResource.class);

    private static final String ENTITY_NAME = "remark";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RemarkRepository remarkRepository;

    public RemarkResource(RemarkRepository remarkRepository) {
        this.remarkRepository = remarkRepository;
    }

    /**
     * {@code POST  /remarks} : Create a new remark.
     *
     * @param remark the remark to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new remark, or with status {@code 400 (Bad Request)} if the remark has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/remarks")
    public ResponseEntity<Remark> createRemark(@RequestBody Remark remark) throws URISyntaxException {
        log.debug("REST request to save Remark : {}", remark);
        if (remark.getId() != null) {
            throw new BadRequestAlertException("A new remark cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Remark result = remarkRepository.save(remark);
        return ResponseEntity
            .created(new URI("/api/remarks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /remarks/:id} : Updates an existing remark.
     *
     * @param id the id of the remark to save.
     * @param remark the remark to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated remark,
     * or with status {@code 400 (Bad Request)} if the remark is not valid,
     * or with status {@code 500 (Internal Server Error)} if the remark couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/remarks/{id}")
    public ResponseEntity<Remark> updateRemark(@PathVariable(value = "id", required = false) final Long id, @RequestBody Remark remark)
        throws URISyntaxException {
        log.debug("REST request to update Remark : {}, {}", id, remark);
        if (remark.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, remark.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!remarkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Remark result = remarkRepository.save(remark);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, remark.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /remarks/:id} : Partial updates given fields of an existing remark, field will ignore if it is null
     *
     * @param id the id of the remark to save.
     * @param remark the remark to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated remark,
     * or with status {@code 400 (Bad Request)} if the remark is not valid,
     * or with status {@code 404 (Not Found)} if the remark is not found,
     * or with status {@code 500 (Internal Server Error)} if the remark couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/remarks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Remark> partialUpdateRemark(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Remark remark
    ) throws URISyntaxException {
        log.debug("REST request to partial update Remark partially : {}, {}", id, remark);
        if (remark.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, remark.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!remarkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Remark> result = remarkRepository
            .findById(remark.getId())
            .map(existingRemark -> {
                if (remark.getMessage() != null) {
                    existingRemark.setMessage(remark.getMessage());
                }
                if (remark.getDate() != null) {
                    existingRemark.setDate(remark.getDate());
                }

                return existingRemark;
            })
            .map(remarkRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, remark.getId().toString())
        );
    }

    /**
     * {@code GET  /remarks} : get all the remarks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of remarks in body.
     */
    @GetMapping("/remarks")
    public List<Remark> getAllRemarks() {
        log.debug("REST request to get all Remarks");
        return remarkRepository.findAll();
    }

    /**
     * {@code GET  /remarks/:id} : get the "id" remark.
     *
     * @param id the id of the remark to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the remark, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/remarks/{id}")
    public ResponseEntity<Remark> getRemark(@PathVariable Long id) {
        log.debug("REST request to get Remark : {}", id);
        Optional<Remark> remark = remarkRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(remark);
    }

    /**
     * {@code DELETE  /remarks/:id} : delete the "id" remark.
     *
     * @param id the id of the remark to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/remarks/{id}")
    public ResponseEntity<Void> deleteRemark(@PathVariable Long id) {
        log.debug("REST request to delete Remark : {}", id);
        remarkRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
