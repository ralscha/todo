package ch.rasc.todo.service;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Validator;

import org.bson.conversions.Bson;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.mongodb.client.DistinctIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import com.mongodb.client.model.Updates;

import ch.ralscha.extdirectspring.annotation.ExtDirectMethod;
import ch.ralscha.extdirectspring.annotation.ExtDirectMethodType;
import ch.ralscha.extdirectspring.bean.EdStoreResult;
import ch.rasc.todo.config.MongoDb;
import ch.rasc.todo.dto.AuditType;
import ch.rasc.todo.dto.EntityChangeEvent;
import ch.rasc.todo.entity.CTodo;
import ch.rasc.todo.entity.Todo;
import ch.rasc.todo.util.QueryUtil;
import ch.rasc.todo.util.ValidationMessages;
import ch.rasc.todo.util.ValidationMessagesResult;
import ch.rasc.todo.util.ValidationUtil;

@Service
public class TodoService {

	private final Validator validator;

	private final MongoDb mongoDb;

	private final ApplicationEventPublisher publisher;

	private final ObjectMapper objectMapper;

	public TodoService(MongoDb mongoDb, ApplicationEventPublisher publisher,
			Validator validator, ObjectMapper objectMapper) {
		this.mongoDb = mongoDb;
		this.publisher = publisher;
		this.validator = validator;
		this.objectMapper = objectMapper;
	}

	@ExtDirectMethod(ExtDirectMethodType.STORE_READ)
	public ArrayNode readTags() {

		ArrayNode an = this.objectMapper.createArrayNode();
		DistinctIterable<String> distinct = this.mongoDb.getCollection(Todo.class)
				.distinct(CTodo.tags, String.class).filter(Filters.exists(CTodo.tags));
		QueryUtil.stream(distinct).map(s -> this.objectMapper.createArrayNode().add(s))
				.forEach(an::add);
		return an;
	}

	@ExtDirectMethod(ExtDirectMethodType.STORE_READ)
	public EdStoreResult<Todo> read() {
		FindIterable<Todo> find = this.mongoDb.getCollection(Todo.class).find();

		List<Todo> result = QueryUtil.toList(find);
		return EdStoreResult.success(result, Long.valueOf(result.size()));
	}

	@ExtDirectMethod(ExtDirectMethodType.STORE_MODIFY)
	public void destroy(String id, HttpServletRequest request) {
		Todo todo = this.mongoDb.getCollection(Todo.class)
				.findOneAndDelete(Filters.eq(CTodo.id, id));
		if (todo != null) {
			this.publisher.publishEvent(EntityChangeEvent.of(AuditType.DELETE,
					request.getRemoteAddr(), todo));
		}
	}

	@ExtDirectMethod(value = ExtDirectMethodType.STORE_MODIFY)
	public ValidationMessagesResult<Todo> update(Todo changedTodo,
			HttpServletRequest request) {
		List<ValidationMessages> violations = new ArrayList<>();
		violations.addAll(ValidationUtil.validateEntity(this.validator, changedTodo));

		if (violations.isEmpty()) {
			List<Bson> updates = new ArrayList<>();
			updates.add(Updates.set(CTodo.description, changedTodo.getDescription()));
			updates.add(Updates.set(CTodo.due, changedTodo.getDue()));
			updates.add(Updates.set(CTodo.tags, changedTodo.getTags()));
			updates.add(Updates.set(CTodo.title, changedTodo.getTitle()));
			Todo updatedTodo = this.mongoDb.getCollection(Todo.class).findOneAndUpdate(
					Filters.eq(CTodo.id, changedTodo.getId()), Updates.combine(updates),
					new FindOneAndUpdateOptions().upsert(true)
							.returnDocument(ReturnDocument.AFTER));

			this.publisher.publishEvent(EntityChangeEvent.of(AuditType.UPDATE,
					request.getRemoteAddr(), updatedTodo));

			return new ValidationMessagesResult<>(updatedTodo);
		}

		ValidationMessagesResult<Todo> result = new ValidationMessagesResult<>(
				changedTodo);
		result.setValidations(violations);
		return result;
	}

}
