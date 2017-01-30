package ch.rasc.todo.service;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import org.javers.core.diff.Change;
import org.javers.core.diff.changetype.NewObject;
import org.javers.core.diff.changetype.ObjectRemoved;
import org.javers.core.diff.changetype.ValueChange;
import org.javers.core.diff.changetype.container.ListChange;
import org.javers.repository.jql.QueryBuilder;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import ch.ralscha.extdirectspring.annotation.ExtDirectMethod;
import ch.ralscha.extdirectspring.annotation.ExtDirectMethodType;
import ch.rasc.sse.eventbus.SseEvent;
import ch.rasc.todo.config.MongoDb;
import ch.rasc.todo.dto.Audit;
import ch.rasc.todo.dto.AuditType;
import ch.rasc.todo.dto.EntityChangeEvent;
import ch.rasc.todo.dto.ImmutableAudit;
import ch.rasc.todo.entity.Todo;

@Service
public class ChangesService {

	private final MongoDb mongoDb;

	private final ApplicationEventPublisher publisher;

	public ChangesService(MongoDb mongoDb, ApplicationEventPublisher publisher) {
		this.mongoDb = mongoDb;
		this.publisher = publisher;
	}

	@EventListener
	@Async
	public void handleEvent(EntityChangeEvent event) {
		if (event.type() != AuditType.DELETE) {
			this.mongoDb.javers().commit(event.author(), event.entity());
		}
		else {
			this.mongoDb.javers().commitShallowDelete(event.author(), event.entity());
		}

		this.publisher.publishEvent(SseEvent.ofEvent("historychange"));
	}

	@ExtDirectMethod(ExtDirectMethodType.STORE_READ)
	public List<Audit> getTodoChanges() {
		QueryBuilder jqlQuery = QueryBuilder.byClass(Todo.class).withNewObjectChanges();

		List<Change> changes = this.mongoDb.javers().findChanges(jqlQuery.build());
		List<Audit> audits = new ArrayList<>();
		for (Change change : changes) {
			ImmutableAudit.Builder builder = ImmutableAudit.builder();
			builder.todoId((String) change.getAffectedLocalId());
			builder.timestamp(change.getCommitMetadata().get().getCommitDate()
					.toEpochSecond(ZoneOffset.UTC));
			if (change instanceof NewObject) {
				builder.type(AuditType.INSERT);
			}
			else if (change instanceof ValueChange) {
				builder.type(AuditType.UPDATE);
				ValueChange pc = (ValueChange) change;
				builder.property(pc.getPropertyName());
				builder.left(pc.getLeft());
				builder.right(pc.getRight());
			}
			else if (change instanceof ObjectRemoved) {
				builder.type(AuditType.DELETE);
			}
			else if (change instanceof ListChange) {
				builder.type(AuditType.UPDATE);
				ListChange pc = (ListChange) change;
				builder.property(pc.getPropertyName());
			}
			audits.add(builder.build());
		}
		return audits;
	}
}
