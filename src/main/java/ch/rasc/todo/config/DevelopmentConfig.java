package ch.rasc.todo.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;

import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.CorsFilter;

import ch.ralscha.extdirectspring.util.ExtDirectSpringUtil;

@Configuration
@Profile("development")
class DevelopmentConfig {

	@Bean
	public FilterRegistrationBean corsFilterRegistration() {
		FilterRegistrationBean filter = new FilterRegistrationBean();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(Collections.singletonList(CorsConfiguration.ALL));
		config.setAllowedMethods(Collections.singletonList(CorsConfiguration.ALL));
		config.setAllowedHeaders(Collections.singletonList(CorsConfiguration.ALL));
		config.setAllowCredentials(true);
		filter.setFilter(new CorsFilter(r -> config));
		filter.setUrlPatterns(Collections.singleton("/*"));
		filter.setOrder(SecurityProperties.DEFAULT_FILTER_ORDER - 1);
		return filter;
	}

	@EventListener
	public void handleContextRefresh(ApplicationReadyEvent event) throws IOException {
		String extDirectConfig = ExtDirectSpringUtil
				.generateApiString(event.getApplicationContext());
		String userDir = System.getProperty("user.dir");
		Files.write(Paths.get(userDir, "client", "api.js"),
				extDirectConfig.getBytes(StandardCharsets.UTF_8));
	}

}
