package ch.rasc.todo.dto;

import javax.annotation.Nullable;

import org.immutables.value.Value;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(as = ImmutableAudit.class)
@Value.Immutable(copy = false)
public interface Audit {
	long timestamp();

	AuditType type();

	String todoId();

	@Nullable
	String property();

	@Nullable
	Object left();

	@Nullable
	Object right();
}
