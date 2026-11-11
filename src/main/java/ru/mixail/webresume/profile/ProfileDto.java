package ru.mixail.webresume.profile;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ProfileDto(
        @NotBlank @Size(max = 200) String fullName,
        @Size(max = 300) String headline,
        String bio,
        @Size(max = 500) String photoUrl,
        @Size(max = 200) String email,
        @Size(max = 50) String phone,
        @Size(max = 200) String location,
        @Size(max = 500) String resumeFileUrl,
        @NotNull List<@Valid SocialLinkDto> socialLinks) {

    public record SocialLinkDto(@NotBlank @Size(max = 100) String name, @NotBlank @Size(max = 500) String url) {
    }

    static ProfileDto from(Profile p) {
        return new ProfileDto(p.getFullName(), p.getHeadline(), p.getBio(), p.getPhotoUrl(), p.getEmail(),
                p.getPhone(), p.getLocation(), p.getResumeFileUrl(),
                p.getSocialLinks().stream().map(l -> new SocialLinkDto(l.getName(), l.getUrl())).toList());
    }
}
