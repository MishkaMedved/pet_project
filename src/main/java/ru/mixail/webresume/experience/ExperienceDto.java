package ru.mixail.webresume.experience;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ExperienceDto(
        Long id,
        @NotNull ExperienceType type,
        @NotBlank @Size(max = 200) String organization,
        @Size(max = 200) String position,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        int sortOrder) {

    static ExperienceDto from(Experience e) {
        return new ExperienceDto(e.getId(), e.getType(), e.getOrganization(), e.getPosition(), e.getDescription(),
                e.getStartDate(), e.getEndDate(), e.getSortOrder());
    }

    void applyTo(Experience e) {
        e.setType(type);
        e.setOrganization(organization);
        e.setPosition(position);
        e.setDescription(description);
        e.setStartDate(startDate);
        e.setEndDate(endDate);
        e.setSortOrder(sortOrder);
    }
}
