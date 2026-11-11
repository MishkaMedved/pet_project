package ru.mixail.webresume.media;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import ru.mixail.webresume.file.FileStorageService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MediaItemController {

    private static final Sort NEWEST_FIRST = Sort.by(Sort.Order.desc("createdAt"));

    private final MediaItemRepository repository;
    private final FileStorageService storage;

    @GetMapping("/api/media")
    public List<MediaItemDto> list(@RequestParam(required = false) MediaType type) {
        List<MediaItem> items = type == null
                ? repository.findAll(NEWEST_FIRST)
                : repository.findByType(type, NEWEST_FIRST);
        return items.stream().map(MediaItemDto::from).toList();
    }

    @PostMapping("/api/admin/media")
    @ResponseStatus(HttpStatus.CREATED)
    public MediaItemDto create(@Valid @RequestBody MediaItemDto dto) {
        MediaItem m = new MediaItem();
        dto.applyTo(m);
        return MediaItemDto.from(repository.save(m));
    }

    @PutMapping("/api/admin/media/{id}")
    @Transactional
    public MediaItemDto update(@PathVariable long id, @Valid @RequestBody MediaItemDto dto) {
        MediaItem m = find(id);
        String oldUrl = m.getUrl();
        dto.applyTo(m);
        if (!oldUrl.equals(m.getUrl())) {
            storage.deleteIfLocal(oldUrl);
        }
        return MediaItemDto.from(m);
    }

    @DeleteMapping("/api/admin/media/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(@PathVariable long id) {
        MediaItem m = find(id);
        repository.delete(m);
        storage.deleteIfLocal(m.getUrl());
    }

    private MediaItem find(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Файл не найден"));
    }
}
