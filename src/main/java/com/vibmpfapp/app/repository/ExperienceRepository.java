package com.vibmpfapp.app.repository;

import com.vibmpfapp.app.domain.Experience;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Experience entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExperienceRepository extends JpaRepository<Experience, String> {}
