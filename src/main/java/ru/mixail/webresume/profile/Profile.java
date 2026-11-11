package ru.mixail.webresume.profile;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * The single profile of the site owner (always id = 1).
 */
@Entity
@Getter
@Setter
public class Profile {

    public static final long ID = 1L;

    @Id
    private Long id;

    private String fullName;
    private String headline;
    private String bio;
    private String photoUrl;
    private String email;
    private String phone;
    private String location;
    private String resumeFileUrl;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder")
    private List<SocialLink> socialLinks = new ArrayList<>();
}
