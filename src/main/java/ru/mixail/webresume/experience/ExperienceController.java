package ru.mixail.webresume.experience;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExperienceController {

    private static final Sort ORDER = Sort.by(
            Sort.Order.asc("sortOrder"),
            Sort.Order.desc("startDate").nullsLast());

    private final ExperienceRepository repository;

    @GetMapping("/api/experience")
    public List<ExperienceDto> list() {
        return repository.findAll(ORDER).stream().map(ExperienceDto::from).toList();
    }

    @PostMapping("/api/admin/experience")
    @ResponseStatus(HttpStatus.CREATED)
    public ExperienceDto create(@Valid @RequestBody ExperienceDto dto) {
        Experience e = new Experience();
        dto.applyTo(e);
        return ExperienceDto.from(repository.save(e));
    }

    @PutMapping("/api/admin/experience/{id}")
    @Transactional
    public ExperienceDto update(@PathVariable long id, @Valid @RequestBody ExperienceDto dto) {
        Experience e = find(id);
        dto.applyTo(e);
        return ExperienceDto.from(e);
    }

    @DeleteMapping("/api/admin/experience/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        repository.delete(find(id));
    }

    private Experience find(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Запись не найдена"));
    }
}
