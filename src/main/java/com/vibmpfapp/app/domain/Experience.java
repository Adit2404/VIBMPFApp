package com.vibmpfapp.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.springframework.data.domain.Persistable;

/**
 * not an ignored comment
 */
@Schema(description = "not an ignored comment")
@JsonIgnoreProperties(value = { "new" })
@Entity
@Table(name = "experience")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Experience implements Serializable, Persistable<String> {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "title")
    private String title;

    @Column(name = "company")
    private String company;

    @Column(name = "location")
    private String location;

    @Column(name = "sdate")
    private LocalDate sdate;

    @Column(name = "edate")
    private LocalDate edate;

    @Column(name = "description")
    private String description;

    @Transient
    private boolean isPersisted;

    @ManyToOne
    @JsonIgnoreProperties(value = { "atsUser", "experiences", "educations", "atsApplications", "remarks" }, allowSetters = true)
    private Candidate candidate;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Experience id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Experience title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return this.company;
    }

    public Experience company(String company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return this.location;
    }

    public Experience location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getSdate() {
        return this.sdate;
    }

    public Experience sdate(LocalDate sdate) {
        this.setSdate(sdate);
        return this;
    }

    public void setSdate(LocalDate sdate) {
        this.sdate = sdate;
    }

    public LocalDate getEdate() {
        return this.edate;
    }

    public Experience edate(LocalDate edate) {
        this.setEdate(edate);
        return this;
    }

    public void setEdate(LocalDate edate) {
        this.edate = edate;
    }

    public String getDescription() {
        return this.description;
    }

    public Experience description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Transient
    @Override
    public boolean isNew() {
        return !this.isPersisted;
    }

    public Experience setIsPersisted() {
        this.isPersisted = true;
        return this;
    }

    @PostLoad
    @PostPersist
    public void updateEntityState() {
        this.setIsPersisted();
    }

    public Candidate getCandidate() {
        return this.candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public Experience candidate(Candidate candidate) {
        this.setCandidate(candidate);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Experience)) {
            return false;
        }
        return id != null && id.equals(((Experience) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Experience{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", company='" + getCompany() + "'" +
            ", location='" + getLocation() + "'" +
            ", sdate='" + getSdate() + "'" +
            ", edate='" + getEdate() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
