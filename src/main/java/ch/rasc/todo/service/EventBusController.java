package ch.rasc.todo.service;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import ch.ralscha.extdirectspring.annotation.ExtDirectMethod;
import ch.rasc.sse.eventbus.SseEvent;
import ch.rasc.sse.eventbus.SseEventBus;
import ch.rasc.todo.Application;

@Controller
public class EventBusController {

	private final SseEventBus eventBus;

	@Autowired
	public EventBusController(SseEventBus eventBus) {
		this.eventBus = eventBus;
	}

	@GetMapping("/eventbus/{id}")
	public SseEmitter eventbus(@PathVariable(value = "id") String id,
			HttpServletResponse response) {
		response.setHeader("Cache-Control", "no-store");
		return this.eventBus.createSseEmitter(id, SseEvent.DEFAULT_EVENT);
	}

	@ExtDirectMethod
	public void subscribe(String id, String event) {
		this.eventBus.subscribe(id, event);
	}

	@ExtDirectMethod
	public void unsubscribe(String id, String event) {
		this.eventBus.unsubscribe(id, event);
	}

	@ExtDirectMethod
	public void unregisterClient(String id) {
		this.eventBus.unregisterClient(id);
	}

	@Async
	@ExtDirectMethod
	public void logClientCrash(@RequestHeader(value = HttpHeaders.USER_AGENT,
			required = false) String userAgent, String type, String detail) {

		StringBuilder sb = new StringBuilder();
		sb.append("JavaScript Error");
		sb.append("\n");
		sb.append("User-Agent: " + userAgent);
		sb.append("\n");
		sb.append(type);
		sb.append("\n");
		sb.append(detail);
		sb.append("\n");

		Application.logger.error(sb.toString());
	}
}
