package ch.rasc.todo.config;

import org.bson.codecs.configuration.CodecRegistries;
import org.javers.core.Javers;
import org.javers.core.JaversBuilder;
import org.javers.repository.mongo.MongoRepository;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoDatabase;

@Configuration
@EnableConfigurationProperties(MongoProperties.class)
public class MongoConfig {

	@Bean
	public MongoClient mongoClient(MongoProperties properties) {
		MongoClientURI uri = new MongoClientURI(properties.getUri());
		return new MongoClient(uri);
	}

	@Bean
	public MongoDatabase mongoDatabase(MongoClient mongoClient,
			MongoProperties properties) {
		MongoClientURI uri = new MongoClientURI(properties.getUri());
		return mongoClient.getDatabase(uri.getDatabase())
				.withCodecRegistry(CodecRegistries.fromRegistries(
						MongoClient.getDefaultCodecRegistry(),
						CodecRegistries.fromProviders(new ListCodec.Provider()),
						CodecRegistries.fromProviders(
								new ch.rasc.todo.config.PojoCodecProvider())));
	}

	@Bean
	public Javers javers(MongoDatabase mongoDatabase) {
		MongoRepository javersMongoRepository = new MongoRepository(mongoDatabase);

		return JaversBuilder.javers().registerJaversRepository(javersMongoRepository)
				.build();
	}

}
