package com.vibmpfapp.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A AtsUser.
 */
@Entity
@Table(name = "ats_user")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AtsUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "user_id")
    private String userId;

    @Lob
    @Column(name = "video")
    private byte[] video;

    @Column(name = "video_content_type")
    private String videoContentType;

    @Lob
    @Column(name = "cv")
    private byte[] cv;

    @Column(name = "cv_content_type")
    private String cvContentType;

    @Column(name = "password")
    private String password;

    @Column(name = "usertype")
    private String usertype;

    @Column(name = "street_address")
    private String streetAddress;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "city")
    private String city;

    @Column(name = "state_province")
    private String stateProvince;

    @JsonIgnoreProperties(value = { "atsUser", "experiences", "educations", "atsApplications", "remarks" }, allowSetters = true)
    @OneToOne(mappedBy = "atsUser")
    private Candidate candidate;

    @JsonIgnoreProperties(value = { "atsUser", "remarks", "company" }, allowSetters = true)
    @OneToOne(mappedBy = "atsUser")
    private CompanyUser companyUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AtsUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public AtsUser firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public AtsUser lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public AtsUser email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public AtsUser phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUserId() {
        return this.userId;
    }

    public AtsUser userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public byte[] getVideo() {
        return this.video;
    }

    public AtsUser video(byte[] video) {
        this.setVideo(video);
        return this;
    }

    public void setVideo(byte[] video) {
        this.video = video;
    }

    public String getVideoContentType() {
        return this.videoContentType;
    }

    public AtsUser videoContentType(String videoContentType) {
        this.videoContentType = videoContentType;
        return this;
    }

    public void setVideoContentType(String videoContentType) {
        this.videoContentType = videoContentType;
    }

    public byte[] getCv() {
        return this.cv;
    }

    public AtsUser cv(byte[] cv) {
        this.setCv(cv);
        return this;
    }

    public void setCv(byte[] cv) {
        this.cv = cv;
    }

    public String getCvContentType() {
        return this.cvContentType;
    }

    public AtsUser cvContentType(String cvContentType) {
        this.cvContentType = cvContentType;
        return this;
    }

    public void setCvContentType(String cvContentType) {
        this.cvContentType = cvContentType;
    }

    public String getPassword() {
        return this.password;
    }

    public AtsUser password(String password) {
        this.setPassword(password);
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsertype() {
        return this.usertype;
    }

    public AtsUser usertype(String usertype) {
        this.setUsertype(usertype);
        return this;
    }

    public void setUsertype(String usertype) {
        this.usertype = usertype;
    }

    public String getStreetAddress() {
        return this.streetAddress;
    }

    public AtsUser streetAddress(String streetAddress) {
        this.setStreetAddress(streetAddress);
        return this;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public AtsUser postalCode(String postalCode) {
        this.setPostalCode(postalCode);
        return this;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return this.city;
    }

    public AtsUser city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateProvince() {
        return this.stateProvince;
    }

    public AtsUser stateProvince(String stateProvince) {
        this.setStateProvince(stateProvince);
        return this;
    }

    public void setStateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
    }

    public Candidate getCandidate() {
        return this.candidate;
    }

    public void setCandidate(Candidate candidate) {
        if (this.candidate != null) {
            this.candidate.setAtsUser(null);
        }
        if (candidate != null) {
            candidate.setAtsUser(this);
        }
        this.candidate = candidate;
    }

    public AtsUser candidate(Candidate candidate) {
        this.setCandidate(candidate);
        return this;
    }

    public CompanyUser getCompanyUser() {
        return this.companyUser;
    }

    public void setCompanyUser(CompanyUser companyUser) {
        if (this.companyUser != null) {
            this.companyUser.setAtsUser(null);
        }
        if (companyUser != null) {
            companyUser.setAtsUser(this);
        }
        this.companyUser = companyUser;
    }

    public AtsUser companyUser(CompanyUser companyUser) {
        this.setCompanyUser(companyUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AtsUser)) {
            return false;
        }
        return id != null && id.equals(((AtsUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AtsUser{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", userId='" + getUserId() + "'" +
            ", video='" + getVideo() + "'" +
            ", videoContentType='" + getVideoContentType() + "'" +
            ", cv='" + getCv() + "'" +
            ", cvContentType='" + getCvContentType() + "'" +
            ", password='" + getPassword() + "'" +
            ", usertype='" + getUsertype() + "'" +
            ", streetAddress='" + getStreetAddress() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            ", city='" + getCity() + "'" +
            ", stateProvince='" + getStateProvince() + "'" +
            "}";
    }
}
