package ru.mixail.webresume.file;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService storage;

    public record UploadResponse(String url) {
    }

    @PostMapping("/api/admin/files")
    public UploadResponse upload(@RequestParam("file") MultipartFile file) {
        return new UploadResponse(storage.store(file));
    }
}
