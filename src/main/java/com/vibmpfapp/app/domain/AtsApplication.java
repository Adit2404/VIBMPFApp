package com.vibmpfapp.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A AtsApplication.
 */
@Entity
@Table(name = "ats_application")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AtsApplication implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @OneToMany(mappedBy = "atsApplication")
    @JsonIgnoreProperties(value = { "atsApplication", "companyUser", "candidate" }, allowSetters = true)
    private Set<Remark> remarks = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "atsUser", "experiences", "educations", "atsApplications", "remarks" }, allowSetters = true)
    private Candidate candidate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "atsApplications", "company" }, allowSetters = true)
    private Vacancy vacancy;

    @ManyToOne
    @JsonIgnoreProperties(value = { "atsApplications", "company" }, allowSetters = true)
    private CompanyApplicationStatus companyApplicationStatus;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AtsApplication id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public AtsApplication date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Set<Remark> getRemarks() {
        return this.remarks;
    }

    public void setRemarks(Set<Remark> remarks) {
        if (this.remarks != null) {
            this.remarks.forEach(i -> i.setAtsApplication(null));
        }
        if (remarks != null) {
            remarks.forEach(i -> i.setAtsApplication(this));
        }
        this.remarks = remarks;
    }

    public AtsApplication remarks(Set<Remark> remarks) {
        this.setRemarks(remarks);
        return this;
    }

    public AtsApplication addRemark(Remark remark) {
        this.remarks.add(remark);
        remark.setAtsApplication(this);
        return this;
    }

    public AtsApplication removeRemark(Remark remark) {
        this.remarks.remove(remark);
        remark.setAtsApplication(null);
        return this;
    }

    public Candidate getCandidate() {
        return this.candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public AtsApplication candidate(Candidate candidate) {
        this.setCandidate(candidate);
        return this;
    }

    public Vacancy getVacancy() {
        return this.vacancy;
    }

    public void setVacancy(Vacancy vacancy) {
        this.vacancy = vacancy;
    }

    public AtsApplication vacancy(Vacancy vacancy) {
        this.setVacancy(vacancy);
        return this;
    }

    public CompanyApplicationStatus getCompanyApplicationStatus() {
        return this.companyApplicationStatus;
    }

    public void setCompanyApplicationStatus(CompanyApplicationStatus companyApplicationStatus) {
        this.companyApplicationStatus = companyApplicationStatus;
    }

    public AtsApplication companyApplicationStatus(CompanyApplicationStatus companyApplicationStatus) {
        this.setCompanyApplicationStatus(companyApplicationStatus);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AtsApplication)) {
            return false;
        }
        return id != null && id.equals(((AtsApplication) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AtsApplication{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
