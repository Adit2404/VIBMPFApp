package com.vibmpfapp.app.repository;

import com.vibmpfapp.app.domain.CompanyApplicationStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CompanyApplicationStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanyApplicationStatusRepository extends JpaRepository<CompanyApplicationStatus, Long> {}
