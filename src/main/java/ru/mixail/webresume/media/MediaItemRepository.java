package ru.mixail.webresume.media;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaItemRepository extends JpaRepository<MediaItem, Long> {

    List<MediaItem> findByType(MediaType type, Sort sort);
}
