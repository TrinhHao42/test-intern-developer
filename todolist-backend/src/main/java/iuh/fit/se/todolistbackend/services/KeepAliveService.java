package iuh.fit.se.todolistbackend.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class KeepAliveService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.external-url:}")
    private String externalUrl;

    // Run every 5 minutes (300,000 milliseconds)
    @Scheduled(fixedDelay = 300000)
    public void pingSelf() {
        if (externalUrl != null && !externalUrl.isBlank()) {
            try {
                String pingUrl = externalUrl.trim();
                if (!pingUrl.endsWith("/")) {
                    pingUrl += "/";
                }
                pingUrl += "auth/ping";
                
                log.info("Sending keep-alive ping to {}", pingUrl);
                restTemplate.getForObject(pingUrl, Void.class);
                log.info("Keep-alive ping successful!");
            } catch (Exception e) {
                log.error("Failed to send keep-alive ping: {}", e.getMessage());
            }
        }
    }
}
