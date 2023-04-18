package com.vibmpfapp.app.repository;

import com.vibmpfapp.app.domain.AtsApplication;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AtsApplication entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AtsApplicationRepository extends JpaRepository<AtsApplication, Long> {}
