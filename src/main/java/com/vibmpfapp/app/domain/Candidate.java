package com.vibmpfapp.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Candidate.
 */
@Entity
@Table(name = "candidate")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Candidate implements Serializable {

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

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = { "candidate" }, allowSetters = true)
    private Set<Experience> experiences = new HashSet<>();

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = { "candidate" }, allowSetters = true)
    private Set<Education> educations = new HashSet<>();

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = { "remarks", "candidate", "vacancy", "companyApplicationStatus" }, allowSetters = true)
    private Set<AtsApplication> atsApplications = new HashSet<>();

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = { "atsApplication", "companyUser", "candidate" }, allowSetters = true)
    private Set<Remark> remarks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Candidate id(Long id) {
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

    public Candidate atsUser(AtsUser atsUser) {
        this.setAtsUser(atsUser);
        return this;
    }

    public Set<Experience> getExperiences() {
        return this.experiences;
    }

    public void setExperiences(Set<Experience> experiences) {
        if (this.experiences != null) {
            this.experiences.forEach(i -> i.setCandidate(null));
        }
        if (experiences != null) {
            experiences.forEach(i -> i.setCandidate(this));
        }
        this.experiences = experiences;
    }

    public Candidate experiences(Set<Experience> experiences) {
        this.setExperiences(experiences);
        return this;
    }

    public Candidate addExperience(Experience experience) {
        this.experiences.add(experience);
        experience.setCandidate(this);
        return this;
    }

    public Candidate removeExperience(Experience experience) {
        this.experiences.remove(experience);
        experience.setCandidate(null);
        return this;
    }

    public Set<Education> getEducations() {
        return this.educations;
    }

    public void setEducations(Set<Education> educations) {
        if (this.educations != null) {
            this.educations.forEach(i -> i.setCandidate(null));
        }
        if (educations != null) {
            educations.forEach(i -> i.setCandidate(this));
        }
        this.educations = educations;
    }

    public Candidate educations(Set<Education> educations) {
        this.setEducations(educations);
        return this;
    }

    public Candidate addEducation(Education education) {
        this.educations.add(education);
        education.setCandidate(this);
        return this;
    }

    public Candidate removeEducation(Education education) {
        this.educations.remove(education);
        education.setCandidate(null);
        return this;
    }

    public Set<AtsApplication> getAtsApplications() {
        return this.atsApplications;
    }

    public void setAtsApplications(Set<AtsApplication> atsApplications) {
        if (this.atsApplications != null) {
            this.atsApplications.forEach(i -> i.setCandidate(null));
        }
        if (atsApplications != null) {
            atsApplications.forEach(i -> i.setCandidate(this));
        }
        this.atsApplications = atsApplications;
    }

    public Candidate atsApplications(Set<AtsApplication> atsApplications) {
        this.setAtsApplications(atsApplications);
        return this;
    }

    public Candidate addAtsApplication(AtsApplication atsApplication) {
        this.atsApplications.add(atsApplication);
        atsApplication.setCandidate(this);
        return this;
    }

    public Candidate removeAtsApplication(AtsApplication atsApplication) {
        this.atsApplications.remove(atsApplication);
        atsApplication.setCandidate(null);
        return this;
    }

    public Set<Remark> getRemarks() {
        return this.remarks;
    }

    public void setRemarks(Set<Remark> remarks) {
        if (this.remarks != null) {
            this.remarks.forEach(i -> i.setCandidate(null));
        }
        if (remarks != null) {
            remarks.forEach(i -> i.setCandidate(this));
        }
        this.remarks = remarks;
    }

    public Candidate remarks(Set<Remark> remarks) {
        this.setRemarks(remarks);
        return this;
    }

    public Candidate addRemark(Remark remark) {
        this.remarks.add(remark);
        remark.setCandidate(this);
        return this;
    }

    public Candidate removeRemark(Remark remark) {
        this.remarks.remove(remark);
        remark.setCandidate(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Candidate)) {
            return false;
        }
        return id != null && id.equals(((Candidate) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Candidate{" +
            "id=" + getId() +
            "}";
    }
}
