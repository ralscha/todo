package ch.rasc.todo.dto;

import org.immutables.value.Value;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(as = ImmutableAudit.class)
@Value.Immutable(copy = false)
public interface Audit {
	long timestamp();

	AuditType type();

	String todoId();

	String property();

	Object left();

	Object right();
}
