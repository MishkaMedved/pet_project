package ru.mixail.webresume.media;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
public class MediaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private MediaType type;

    private String title;
    private String description;

    /**
     * Either an uploaded file ({@code /uploads/...}) or an external link, e.g. a YouTube/VK video.
     */
    private String url;

    private Instant createdAt = Instant.now();
}
