package com.vibmpfapp.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Vacancy.
 */
@Entity
@Table(name = "vacancy")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vacancy implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "date_of_posting")
    private LocalDate dateOfPosting;

    @Column(name = "description")
    private String description;

    @Column(name = "employment_type")
    private String employmentType;

    @Column(name = "location")
    private String location;

    @Lob
    @Column(name = "video")
    private byte[] video;

    @Column(name = "video_content_type")
    private String videoContentType;

    @Column(name = "status")
    private String status;

    @Column(name = "is_open")
    private Boolean isOpen;

    @OneToMany(mappedBy = "vacancy")
    @JsonIgnoreProperties(value = { "remarks", "candidate", "vacancy", "companyApplicationStatus" }, allowSetters = true)
    private Set<AtsApplication> atsApplications = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "vacancies", "companyUsers", "companyApplicationStatuses" }, allowSetters = true)
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Vacancy id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Vacancy name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfPosting() {
        return this.dateOfPosting;
    }

    public Vacancy dateOfPosting(LocalDate dateOfPosting) {
        this.setDateOfPosting(dateOfPosting);
        return this;
    }

    public void setDateOfPosting(LocalDate dateOfPosting) {
        this.dateOfPosting = dateOfPosting;
    }

    public String getDescription() {
        return this.description;
    }

    public Vacancy description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmploymentType() {
        return this.employmentType;
    }

    public Vacancy employmentType(String employmentType) {
        this.setEmploymentType(employmentType);
        return this;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getLocation() {
        return this.location;
    }

    public Vacancy location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public byte[] getVideo() {
        return this.video;
    }

    public Vacancy video(byte[] video) {
        this.setVideo(video);
        return this;
    }

    public void setVideo(byte[] video) {
        this.video = video;
    }

    public String getVideoContentType() {
        return this.videoContentType;
    }

    public Vacancy videoContentType(String videoContentType) {
        this.videoContentType = videoContentType;
        return this;
    }

    public void setVideoContentType(String videoContentType) {
        this.videoContentType = videoContentType;
    }

    public String getStatus() {
        return this.status;
    }

    public Vacancy status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsOpen() {
        return this.isOpen;
    }

    public Vacancy isOpen(Boolean isOpen) {
        this.setIsOpen(isOpen);
        return this;
    }

    public void setIsOpen(Boolean isOpen) {
        this.isOpen = isOpen;
    }

    public Set<AtsApplication> getAtsApplications() {
        return this.atsApplications;
    }

    public void setAtsApplications(Set<AtsApplication> atsApplications) {
        if (this.atsApplications != null) {
            this.atsApplications.forEach(i -> i.setVacancy(null));
        }
        if (atsApplications != null) {
            atsApplications.forEach(i -> i.setVacancy(this));
        }
        this.atsApplications = atsApplications;
    }

    public Vacancy atsApplications(Set<AtsApplication> atsApplications) {
        this.setAtsApplications(atsApplications);
        return this;
    }

    public Vacancy addAtsApplication(AtsApplication atsApplication) {
        this.atsApplications.add(atsApplication);
        atsApplication.setVacancy(this);
        return this;
    }

    public Vacancy removeAtsApplication(AtsApplication atsApplication) {
        this.atsApplications.remove(atsApplication);
        atsApplication.setVacancy(null);
        return this;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Vacancy company(Company company) {
        this.setCompany(company);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vacancy)) {
            return false;
        }
        return id != null && id.equals(((Vacancy) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vacancy{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", dateOfPosting='" + getDateOfPosting() + "'" +
            ", description='" + getDescription() + "'" +
            ", employmentType='" + getEmploymentType() + "'" +
            ", location='" + getLocation() + "'" +
            ", video='" + getVideo() + "'" +
            ", videoContentType='" + getVideoContentType() + "'" +
            ", status='" + getStatus() + "'" +
            ", isOpen='" + getIsOpen() + "'" +
            "}";
    }
}
