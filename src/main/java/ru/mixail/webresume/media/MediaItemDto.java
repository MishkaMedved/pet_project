package ru.mixail.webresume.media;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MediaItemDto(
        Long id,
        @NotNull MediaType type,
        @Size(max = 300) String title,
        String description,
        @NotBlank @Size(max = 500) String url) {

    static MediaItemDto from(MediaItem m) {
        return new MediaItemDto(m.getId(), m.getType(), m.getTitle(), m.getDescription(), m.getUrl());
    }

    void applyTo(MediaItem m) {
        m.setType(type);
        m.setTitle(title);
        m.setDescription(description);
        m.setUrl(url);
    }
}
