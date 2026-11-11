package ru.mixail.webresume.publication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record PublicationDto(
        Long id,
        @NotBlank @Size(max = 300) String title,
        @NotNull PublicationCategory category,
        @Size(max = 200) String outlet,
        String summary,
        String content,
        @Size(max = 500) String coverUrl,
        @Size(max = 500) String externalUrl,
        LocalDate publishedAt) {

    static PublicationDto from(Publication p) {
        return new PublicationDto(p.getId(), p.getTitle(), p.getCategory(), p.getOutlet(), p.getSummary(),
                p.getContent(), p.getCoverUrl(), p.getExternalUrl(), p.getPublishedAt());
    }

    void applyTo(Publication p) {
        p.setTitle(title);
        p.setCategory(category);
        p.setOutlet(outlet);
        p.setSummary(summary);
        p.setContent(content);
        p.setCoverUrl(coverUrl);
        p.setExternalUrl(externalUrl);
        p.setPublishedAt(publishedAt);
    }
}
