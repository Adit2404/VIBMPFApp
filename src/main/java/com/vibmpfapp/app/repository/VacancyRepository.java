package com.vibmpfapp.app.repository;

import com.vibmpfapp.app.domain.Vacancy;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vacancy entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, Long> {}
