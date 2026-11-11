package ru.mixail.webresume.profile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileRepository repository;

    @GetMapping("/api/profile")
    @Transactional(readOnly = true)
    public ProfileDto get() {
        return ProfileDto.from(repository.getReferenceById(Profile.ID));
    }

    @PutMapping("/api/admin/profile")
    @Transactional
    public ProfileDto update(@Valid @RequestBody ProfileDto dto) {
        Profile p = repository.getReferenceById(Profile.ID);
        p.setFullName(dto.fullName());
        p.setHeadline(dto.headline());
        p.setBio(dto.bio());
        p.setPhotoUrl(dto.photoUrl());
        p.setEmail(dto.email());
        p.setPhone(dto.phone());
        p.setLocation(dto.location());
        p.setResumeFileUrl(dto.resumeFileUrl());

        p.getSocialLinks().clear();
        for (int i = 0; i < dto.socialLinks().size(); i++) {
            ProfileDto.SocialLinkDto linkDto = dto.socialLinks().get(i);
            SocialLink link = new SocialLink();
            link.setProfile(p);
            link.setName(linkDto.name());
            link.setUrl(linkDto.url());
            link.setSortOrder(i);
            p.getSocialLinks().add(link);
        }
        repository.flush();
        return ProfileDto.from(p);
    }
}
