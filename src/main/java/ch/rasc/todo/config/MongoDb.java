package ch.rasc.todo.config;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.bson.BsonType;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.javers.core.Javers;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.CreateCollectionOptions;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Indexes;
import com.mongodb.client.model.ValidationAction;
import com.mongodb.client.model.ValidationLevel;
import com.mongodb.client.model.ValidationOptions;

import ch.rasc.todo.entity.CTodo;
import ch.rasc.todo.entity.Todo;

@Component
public class MongoDb {

	private final MongoDatabase mongoDatabase;

	private final Javers javers;

	public MongoDb(final MongoDatabase mongoDatabase, final Javers javers) {
		this.mongoDatabase = mongoDatabase;
		this.javers = javers;
	}

	@PostConstruct
	public void setup() {

		if (!collectionExists(Todo.class)) {
			CreateCollectionOptions options = new CreateCollectionOptions();
			ValidationOptions validationOptions = new ValidationOptions();
			validationOptions.validationAction(ValidationAction.ERROR);
			validationOptions.validationLevel(ValidationLevel.STRICT);

			List<Bson> validations = new ArrayList<>();

			validations.add(Filters.ne(CTodo.title, null));
			validations.add(Filters.type(CTodo.title, BsonType.STRING));

			validationOptions.validator(Filters.and(validations));
			options.validationOptions(validationOptions);
			this.getMongoDatabase().createCollection(getCollectionName(Todo.class),
					options);
		}

		if (!indexExists(Todo.class, CTodo.tags)) {
			this.getCollection(Todo.class).createIndex(Indexes.ascending(CTodo.tags));
		}
	}

	public boolean indexExists(Class<?> clazz, String indexName) {
		return indexExists(this.getCollection(clazz), indexName);
	}

	public boolean indexExists(MongoCollection<?> collection, String indexName) {
		for (Document doc : collection.listIndexes()) {
			Document key = (Document) doc.get("key");
			if (key != null) {
				if (key.containsKey(indexName)) {
					return true;
				}
			}
		}
		return false;
	}

	public <T> T findFirst(Class<T> documentClass, String field, Object value) {
		return getCollection(documentClass).find(Filters.eq(field, value)).first();
	}

	public boolean collectionExists(final Class<?> clazz) {
		return collectionExists(getCollectionName(clazz));
	}

	public boolean collectionExists(final String collectionName) {
		return this.getMongoDatabase().listCollections()
				.filter(Filters.eq("name", collectionName)).first() != null;
	}

	public Javers javers() {
		return this.javers;
	}

	public MongoDatabase getMongoDatabase() {
		return this.mongoDatabase;
	}

	public <T> MongoCollection<T> getCollection(Class<T> documentClass) {
		return this.getMongoDatabase().getCollection(getCollectionName(documentClass),
				documentClass);
	}

	private static String getCollectionName(Class<?> documentClass) {
		return StringUtils.uncapitalize(documentClass.getSimpleName());
	}

	public <T> MongoCollection<T> getCollection(String collectionName,
			Class<T> documentClass) {
		return this.getMongoDatabase().getCollection(collectionName, documentClass);
	}

	public MongoCollection<Document> getCollection(String collectionName) {
		return this.getMongoDatabase().getCollection(collectionName);
	}

	public long count(Class<?> documentClass) {
		return this.getCollection(documentClass).count();
	}

}
