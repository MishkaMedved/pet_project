package ru.mixail.webresume.skill;

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
public class SkillController {

    private static final Sort ORDER = Sort.by("sortOrder", "id");

    private final SkillRepository repository;

    @GetMapping("/api/skills")
    public List<SkillDto> list() {
        return repository.findAll(ORDER).stream().map(SkillDto::from).toList();
    }

    @PostMapping("/api/admin/skills")
    @ResponseStatus(HttpStatus.CREATED)
    public SkillDto create(@Valid @RequestBody SkillDto dto) {
        Skill s = new Skill();
        dto.applyTo(s);
        return SkillDto.from(repository.save(s));
    }

    @PutMapping("/api/admin/skills/{id}")
    @Transactional
    public SkillDto update(@PathVariable long id, @Valid @RequestBody SkillDto dto) {
        Skill s = find(id);
        dto.applyTo(s);
        return SkillDto.from(s);
    }

    @DeleteMapping("/api/admin/skills/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        repository.delete(find(id));
    }

    private Skill find(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Навык не найден"));
    }
}
