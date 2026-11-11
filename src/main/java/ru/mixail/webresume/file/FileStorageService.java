package ru.mixail.webresume.file;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import ru.mixail.webresume.config.AppProperties;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    public static final String URL_PREFIX = "/uploads/";

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp", "gif",
            "mp4", "webm", "mov",
            "pdf", "doc", "docx");

    private final Path root;

    public FileStorageService(AppProperties properties) throws IOException {
        this.root = properties.uploadDir().toAbsolutePath().normalize();
        Files.createDirectories(root);
    }

    /**
     * Saves the file under a random name and returns its public URL.
     */
    public String store(MultipartFile file) {
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        if (extension == null || !ALLOWED_EXTENSIONS.contains(extension.toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Недопустимый тип файла. Разрешены: " + String.join(", ", ALLOWED_EXTENSIONS));
        }
        String name = UUID.randomUUID() + "." + extension.toLowerCase(Locale.ROOT);
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, root.resolve(name));
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store file", e);
        }
        return URL_PREFIX + name;
    }

    /**
     * Removes a previously uploaded file; URLs pointing elsewhere are ignored.
     */
    public void deleteIfLocal(String url) {
        if (url == null || !url.startsWith(URL_PREFIX)) {
            return;
        }
        Path path = root.resolve(url.substring(URL_PREFIX.length())).normalize();
        if (!path.getParent().equals(root)) {
            return;
        }
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to delete file", e);
        }
    }
}
