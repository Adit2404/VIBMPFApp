package com.vibmpfapp.app.repository;

import com.vibmpfapp.app.domain.Remark;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Remark entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RemarkRepository extends JpaRepository<Remark, Long> {}
