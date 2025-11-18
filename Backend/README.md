# EventCraft Backend

Event management system backend built with Spring Boot and MongoDB.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB 4.4+

## Environment Variables

Create a `.env` file or set the following environment variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/eventCraftDB

# Server Configuration
PORT=8080

# Google Gemini API Key (optional)
GOOGLE_API_KEY=your-google-api-key-here
```

## Running the Application

### Development
```bash
mvn spring-boot:run
```

### Production
```bash
mvn clean package
java -jar target/EventCraft-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

Or with environment variables:
```bash
export MONGODB_URI=mongodb://your-mongodb-host:27017/eventCraftDB
export PORT=8080
export GOOGLE_API_KEY=your-api-key
java -jar target/EventCraft-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## API Endpoints

The API runs on `http://localhost:8080/api` (or your configured port).

## Security Notes

- CORS is configured to allow all origins (`*`). For production, consider restricting this to your frontend domain.
- CSRF is disabled. Consider enabling it for production if needed.
- Default admin account is created automatically with secure password for system support.

## Build

```bash
mvn clean package
```

The JAR file will be created in `target/EventCraft-0.0.1-SNAPSHOT.jar`

