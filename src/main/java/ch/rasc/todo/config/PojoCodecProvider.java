package ch.rasc.todo.config;

import org.bson.codecs.Codec;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;

import ch.rasc.todo.entity.Todo;
import ch.rasc.todo.entity.TodoCodec;
import ch.rasc.todo.entity.UUIDStringGenerator;

public final class PojoCodecProvider implements CodecProvider {
	private final UUIDStringGenerator uUIDStringGenerator;

	public PojoCodecProvider() {
		this(new UUIDStringGenerator());
	}

	public PojoCodecProvider(final UUIDStringGenerator uUIDStringGenerator) {
		this.uUIDStringGenerator = uUIDStringGenerator;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> Codec<T> get(final Class<T> clazz, final CodecRegistry registry) {
		if (clazz.equals(Todo.class)) {
			return (Codec<T>) new TodoCodec(this.uUIDStringGenerator);
		}
		return null;
	}
}
