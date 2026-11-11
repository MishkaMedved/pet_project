package ru.mixail.webresume.skill;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SkillDto(
        Long id,
        @NotBlank @Size(max = 100) String name,
        @Size(max = 100) String category,
        int sortOrder) {

    static SkillDto from(Skill s) {
        return new SkillDto(s.getId(), s.getName(), s.getCategory(), s.getSortOrder());
    }

    void applyTo(Skill s) {
        s.setName(name);
        s.setCategory(category);
        s.setSortOrder(sortOrder);
    }
}
