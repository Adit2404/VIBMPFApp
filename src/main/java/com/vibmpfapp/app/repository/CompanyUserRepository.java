package com.vibmpfapp.app.repository;

import com.vibmpfapp.app.domain.CompanyUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CompanyUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanyUserRepository extends JpaRepository<CompanyUser, Long> {}
