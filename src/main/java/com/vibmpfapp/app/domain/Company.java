package com.vibmpfapp.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.springframework.data.domain.Persistable;

/**
 * A Company.
 */
@JsonIgnoreProperties(value = { "new" })
@Entity
@Table(name = "company")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Company implements Serializable, Persistable<String> {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "company_size")
    private Integer companySize;

    @Column(name = "type")
    private String type;

    @Lob
    @Column(name = "video")
    private byte[] video;

    @Column(name = "video_content_type")
    private String videoContentType;

    @Transient
    private boolean isPersisted;

    @OneToMany(mappedBy = "company")
    @JsonIgnoreProperties(value = { "atsApplications", "company" }, allowSetters = true)
    private Set<Vacancy> vacancies = new HashSet<>();

    @OneToMany(mappedBy = "company")
    @JsonIgnoreProperties(value = { "atsUser", "remarks", "company" }, allowSetters = true)
    private Set<CompanyUser> companyUsers = new HashSet<>();

    @OneToMany(mappedBy = "company")
    @JsonIgnoreProperties(value = { "atsApplications", "company" }, allowSetters = true)
    private Set<CompanyApplicationStatus> companyApplicationStatuses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Company id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getCompanySize() {
        return this.companySize;
    }

    public Company companySize(Integer companySize) {
        this.setCompanySize(companySize);
        return this;
    }

    public void setCompanySize(Integer companySize) {
        this.companySize = companySize;
    }

    public String getType() {
        return this.type;
    }

    public Company type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getVideo() {
        return this.video;
    }

    public Company video(byte[] video) {
        this.setVideo(video);
        return this;
    }

    public void setVideo(byte[] video) {
        this.video = video;
    }

    public String getVideoContentType() {
        return this.videoContentType;
    }

    public Company videoContentType(String videoContentType) {
        this.videoContentType = videoContentType;
        return this;
    }

    public void setVideoContentType(String videoContentType) {
        this.videoContentType = videoContentType;
    }

    @Transient
    @Override
    public boolean isNew() {
        return !this.isPersisted;
    }

    public Company setIsPersisted() {
        this.isPersisted = true;
        return this;
    }

    @PostLoad
    @PostPersist
    public void updateEntityState() {
        this.setIsPersisted();
    }

    public Set<Vacancy> getVacancies() {
        return this.vacancies;
    }

    public void setVacancies(Set<Vacancy> vacancies) {
        if (this.vacancies != null) {
            this.vacancies.forEach(i -> i.setCompany(null));
        }
        if (vacancies != null) {
            vacancies.forEach(i -> i.setCompany(this));
        }
        this.vacancies = vacancies;
    }

    public Company vacancies(Set<Vacancy> vacancies) {
        this.setVacancies(vacancies);
        return this;
    }

    public Company addVacancy(Vacancy vacancy) {
        this.vacancies.add(vacancy);
        vacancy.setCompany(this);
        return this;
    }

    public Company removeVacancy(Vacancy vacancy) {
        this.vacancies.remove(vacancy);
        vacancy.setCompany(null);
        return this;
    }

    public Set<CompanyUser> getCompanyUsers() {
        return this.companyUsers;
    }

    public void setCompanyUsers(Set<CompanyUser> companyUsers) {
        if (this.companyUsers != null) {
            this.companyUsers.forEach(i -> i.setCompany(null));
        }
        if (companyUsers != null) {
            companyUsers.forEach(i -> i.setCompany(this));
        }
        this.companyUsers = companyUsers;
    }

    public Company companyUsers(Set<CompanyUser> companyUsers) {
        this.setCompanyUsers(companyUsers);
        return this;
    }

    public Company addCompanyUser(CompanyUser companyUser) {
        this.companyUsers.add(companyUser);
        companyUser.setCompany(this);
        return this;
    }

    public Company removeCompanyUser(CompanyUser companyUser) {
        this.companyUsers.remove(companyUser);
        companyUser.setCompany(null);
        return this;
    }

    public Set<CompanyApplicationStatus> getCompanyApplicationStatuses() {
        return this.companyApplicationStatuses;
    }

    public void setCompanyApplicationStatuses(Set<CompanyApplicationStatus> companyApplicationStatuses) {
        if (this.companyApplicationStatuses != null) {
            this.companyApplicationStatuses.forEach(i -> i.setCompany(null));
        }
        if (companyApplicationStatuses != null) {
            companyApplicationStatuses.forEach(i -> i.setCompany(this));
        }
        this.companyApplicationStatuses = companyApplicationStatuses;
    }

    public Company companyApplicationStatuses(Set<CompanyApplicationStatus> companyApplicationStatuses) {
        this.setCompanyApplicationStatuses(companyApplicationStatuses);
        return this;
    }

    public Company addCompanyApplicationStatus(CompanyApplicationStatus companyApplicationStatus) {
        this.companyApplicationStatuses.add(companyApplicationStatus);
        companyApplicationStatus.setCompany(this);
        return this;
    }

    public Company removeCompanyApplicationStatus(CompanyApplicationStatus companyApplicationStatus) {
        this.companyApplicationStatuses.remove(companyApplicationStatus);
        companyApplicationStatus.setCompany(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Company)) {
            return false;
        }
        return id != null && id.equals(((Company) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Company{" +
            "id=" + getId() +
            ", companySize=" + getCompanySize() +
            ", type='" + getType() + "'" +
            ", video='" + getVideo() + "'" +
            ", videoContentType='" + getVideoContentType() + "'" +
            "}";
    }
}
