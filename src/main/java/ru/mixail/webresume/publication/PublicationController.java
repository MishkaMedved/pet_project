package ru.mixail.webresume.publication;

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

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PublicationController {

    private static final Sort NEWEST_FIRST = Sort.by(
            Sort.Order.desc("publishedAt").nullsLast(),
            Sort.Order.desc("createdAt"));

    private final PublicationRepository repository;

    @GetMapping("/api/publications")
    public List<PublicationDto> list(@RequestParam(required = false) PublicationCategory category) {
        List<Publication> publications = category == null
                ? repository.findAll(NEWEST_FIRST)
                : repository.findByCategory(category, NEWEST_FIRST);
        return publications.stream().map(PublicationDto::from).toList();
    }

    @GetMapping("/api/publications/{id}")
    public PublicationDto get(@PathVariable long id) {
        return PublicationDto.from(find(id));
    }

    @PostMapping("/api/admin/publications")
    @ResponseStatus(HttpStatus.CREATED)
    public PublicationDto create(@Valid @RequestBody PublicationDto dto) {
        Publication p = new Publication();
        dto.applyTo(p);
        return PublicationDto.from(repository.save(p));
    }

    @PutMapping("/api/admin/publications/{id}")
    @Transactional
    public PublicationDto update(@PathVariable long id, @Valid @RequestBody PublicationDto dto) {
        Publication p = find(id);
        dto.applyTo(p);
        return PublicationDto.from(p);
    }

    @DeleteMapping("/api/admin/publications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        repository.delete(find(id));
    }

    private Publication find(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Публикация не найдена"));
    }
}
