package ru.mixail.webresume;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApiSecurityTests {

    private static final String PUBLICATION = """
            {"title": "Репортаж", "category": "REPORT", "outlet": "Газета", "publishedAt": "2026-01-15"}
            """;

    @Autowired
    MockMvc mvc;

    @Test
    void publicEndpointsAreOpen() throws Exception {
        mvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Вероника Сыкулева"));
        mvc.perform(get("/api/publications")).andExpect(status().isOk());
        mvc.perform(get("/api/experience")).andExpect(status().isOk());
        mvc.perform(get("/api/skills")).andExpect(status().isOk());
        mvc.perform(get("/api/media")).andExpect(status().isOk());
    }

    @Test
    void adminEndpointsRequireToken() throws Exception {
        mvc.perform(post("/api/admin/publications").contentType(MediaType.APPLICATION_JSON).content(PUBLICATION))
                .andExpect(status().isUnauthorized());
        mvc.perform(put("/api/admin/profile").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void wrongPasswordIsRejected() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"admin\", \"password\": \"wrong\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanManageContent() throws Exception {
        String auth = "Bearer " + login();

        String created = mvc.perform(post("/api/admin/publications").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(PUBLICATION))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String id = created.replaceAll(".*\"id\":(\\d+).*", "$1");

        mvc.perform(get("/api/publications/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Репортаж"));
        mvc.perform(get("/api/publications").param("category", "REPORT"))
                .andExpect(jsonPath("$[0].id").value(Long.parseLong(id)));

        mvc.perform(put("/api/admin/profile").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"fullName": "Вероника Сыкулева", "headline": "Журналист",
                                 "socialLinks": [{"name": "Telegram", "url": "https://t.me/example"}]}
                                """))
                .andExpect(status().isOk());
        mvc.perform(get("/api/profile"))
                .andExpect(jsonPath("$.socialLinks[0].name").value("Telegram"));

        String fileUrl = mvc.perform(multipart("/api/admin/files")
                        .file(new MockMultipartFile("file", "photo.png", "image/png", new byte[]{1, 2, 3}))
                        .header("Authorization", auth))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString()
                .replaceAll(".*\"url\":\"([^\"]+)\".*", "$1");
        mvc.perform(get(fileUrl)).andExpect(status().isOk());

        mvc.perform(multipart("/api/admin/files")
                        .file(new MockMultipartFile("file", "evil.html", "text/html", new byte[]{1}))
                        .header("Authorization", auth))
                .andExpect(status().isBadRequest());

        mvc.perform(delete("/api/admin/publications/" + id).header("Authorization", auth))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/publications/" + id)).andExpect(status().isNotFound());
    }

    private String login() throws Exception {
        return mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"admin\", \"password\": \"secret\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString()
                .replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }
}
