package com.vibmpfapp.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A CompanyApplicationStatus.
 */
@Entity
@Table(name = "company_application_status")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CompanyApplicationStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "companyApplicationStatus")
    @JsonIgnoreProperties(value = { "remarks", "candidate", "vacancy", "companyApplicationStatus" }, allowSetters = true)
    private Set<AtsApplication> atsApplications = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "vacancies", "companyUsers", "companyApplicationStatuses" }, allowSetters = true)
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CompanyApplicationStatus id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public CompanyApplicationStatus name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<AtsApplication> getAtsApplications() {
        return this.atsApplications;
    }

    public void setAtsApplications(Set<AtsApplication> atsApplications) {
        if (this.atsApplications != null) {
            this.atsApplications.forEach(i -> i.setCompanyApplicationStatus(null));
        }
        if (atsApplications != null) {
            atsApplications.forEach(i -> i.setCompanyApplicationStatus(this));
        }
        this.atsApplications = atsApplications;
    }

    public CompanyApplicationStatus atsApplications(Set<AtsApplication> atsApplications) {
        this.setAtsApplications(atsApplications);
        return this;
    }

    public CompanyApplicationStatus addAtsApplication(AtsApplication atsApplication) {
        this.atsApplications.add(atsApplication);
        atsApplication.setCompanyApplicationStatus(this);
        return this;
    }

    public CompanyApplicationStatus removeAtsApplication(AtsApplication atsApplication) {
        this.atsApplications.remove(atsApplication);
        atsApplication.setCompanyApplicationStatus(null);
        return this;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public CompanyApplicationStatus company(Company company) {
        this.setCompany(company);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CompanyApplicationStatus)) {
            return false;
        }
        return id != null && id.equals(((CompanyApplicationStatus) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CompanyApplicationStatus{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
