package ch.rasc.todo.entity;

import java.util.List;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ch.rasc.bsoncodec.annotation.BsonDocument;
import ch.rasc.bsoncodec.annotation.Id;
import ch.rasc.extclassgenerator.Model;
import ch.rasc.extclassgenerator.ModelField;
import ch.rasc.extclassgenerator.ModelType;

@BsonDocument
@Model(value = "Todo.model.Todo", readMethod = "todoService.read",
		createMethod = "todoService.update", updateMethod = "todoService.update",
		destroyMethod = "todoService.destroy", rootProperty = "records",
		identifier = "uuid", writeAllFields = true)
@JsonInclude(Include.NON_NULL)
public class Todo {

	@Id(generator = UUIDStringGenerator.class)
	@org.javers.core.metamodel.annotation.Id
	private String id;

	@ModelField(useNull = true, type = ModelType.DATE, dateFormat = "U")
	private Long due;

	@NotEmpty
	private String title;

	@ModelField(useNull = true)
	private List<String> tags;

	@ModelField(useNull = true)
	private String description;

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Long getDue() {
		return this.due;
	}

	public void setDue(Long due) {
		this.due = due;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<String> getTags() {
		return this.tags;
	}

	public void setTags(List<String> tags) {
		this.tags = tags;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
