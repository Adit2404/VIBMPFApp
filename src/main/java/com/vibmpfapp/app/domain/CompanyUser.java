package com.vibmpfapp.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A CompanyUser.
 */
@Entity
@Table(name = "company_user")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CompanyUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @JsonIgnoreProperties(value = { "candidate", "companyUser" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private AtsUser atsUser;

    @OneToMany(mappedBy = "companyUser")
    @JsonIgnoreProperties(value = { "atsApplication", "companyUser", "candidate" }, allowSetters = true)
    private Set<Remark> remarks = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "vacancies", "companyUsers", "companyApplicationStatuses" }, allowSetters = true)
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CompanyUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AtsUser getAtsUser() {
        return this.atsUser;
    }

    public void setAtsUser(AtsUser atsUser) {
        this.atsUser = atsUser;
    }

    public CompanyUser atsUser(AtsUser atsUser) {
        this.setAtsUser(atsUser);
        return this;
    }

    public Set<Remark> getRemarks() {
        return this.remarks;
    }

    public void setRemarks(Set<Remark> remarks) {
        if (this.remarks != null) {
            this.remarks.forEach(i -> i.setCompanyUser(null));
        }
        if (remarks != null) {
            remarks.forEach(i -> i.setCompanyUser(this));
        }
        this.remarks = remarks;
    }

    public CompanyUser remarks(Set<Remark> remarks) {
        this.setRemarks(remarks);
        return this;
    }

    public CompanyUser addRemark(Remark remark) {
        this.remarks.add(remark);
        remark.setCompanyUser(this);
        return this;
    }

    public CompanyUser removeRemark(Remark remark) {
        this.remarks.remove(remark);
        remark.setCompanyUser(null);
        return this;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public CompanyUser company(Company company) {
        this.setCompany(company);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CompanyUser)) {
            return false;
        }
        return id != null && id.equals(((CompanyUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CompanyUser{" +
            "id=" + getId() +
            "}";
    }
}
