package com.vibmpfapp.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A Remark.
 */
@Entity
@Table(name = "remark")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Remark implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "message")
    private String message;

    @Column(name = "date")
    private LocalDate date;

    @ManyToOne
    @JsonIgnoreProperties(value = { "remarks", "candidate", "vacancy", "companyApplicationStatus" }, allowSetters = true)
    private AtsApplication atsApplication;

    @ManyToOne
    @JsonIgnoreProperties(value = { "atsUser", "remarks", "company" }, allowSetters = true)
    private CompanyUser companyUser;

    @ManyToOne
    @JsonIgnoreProperties(value = { "atsUser", "experiences", "educations", "atsApplications", "remarks" }, allowSetters = true)
    private Candidate candidate;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Remark id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return this.message;
    }

    public Remark message(String message) {
        this.setMessage(message);
        return this;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Remark date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public AtsApplication getAtsApplication() {
        return this.atsApplication;
    }

    public void setAtsApplication(AtsApplication atsApplication) {
        this.atsApplication = atsApplication;
    }

    public Remark atsApplication(AtsApplication atsApplication) {
        this.setAtsApplication(atsApplication);
        return this;
    }

    public CompanyUser getCompanyUser() {
        return this.companyUser;
    }

    public void setCompanyUser(CompanyUser companyUser) {
        this.companyUser = companyUser;
    }

    public Remark companyUser(CompanyUser companyUser) {
        this.setCompanyUser(companyUser);
        return this;
    }

    public Candidate getCandidate() {
        return this.candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public Remark candidate(Candidate candidate) {
        this.setCandidate(candidate);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Remark)) {
            return false;
        }
        return id != null && id.equals(((Remark) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Remark{" +
            "id=" + getId() +
            ", message='" + getMessage() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
