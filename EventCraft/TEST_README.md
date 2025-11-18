# EventCraft QA Testing Suite

Comprehensive automated testing suite for EventCraft application covering all test types and business flows.

## Test Coverage

### 1. Unit Tests
- **Service Layer Tests**: Tests business logic in isolation
  - `UserServiceTest.java` - User management logic
  - `EventServiceTest.java` - Event management logic
  - `VendorServiceTest.java` - Vendor management logic

### 2. Repository Tests
- **MongoDB Integration Tests**: Tests database operations using Testcontainers
  - `UserRepositoryTest.java` - User repository operations
  - `EventRepositoryTest.java` - Event repository operations

### 3. Controller/API Tests
- **REST API Integration Tests**: Tests HTTP endpoints
  - `UserControllerTest.java` - User API endpoints
  - `EventControllerTest.java` - Event API endpoints

### 4. End-to-End Flow Tests
- **Complete Business Flow Tests**: Tests full user journeys
  - `EndToEndFlowTest.java` - Complete workflows:
    - User registration and event creation
    - Vendor registration and package creation
    - Event-vendor contract flow
    - Review and rating flow
    - Calendar query flow
    - User-vendor chat flow

### 5. Security Tests
- **Security and Vulnerability Tests**: Tests security aspects
  - `SecurityTest.java` - Security validations:
    - Password hashing
    - Password exposure prevention
    - SQL injection prevention
    - XSS prevention
    - Authentication failure handling
    - Input validation
    - Duplicate user prevention
    - CORS configuration

## Running Tests

### Run All Tests
```bash
mvn test
```

### Run Specific Test Category
```bash
# Unit tests only
mvn test -Dtest=*ServiceTest

# Repository tests only
mvn test -Dtest=*RepositoryTest

# Controller tests only
mvn test -Dtest=*ControllerTest

# End-to-end tests only
mvn test -Dtest=EndToEndFlowTest

# Security tests only
mvn test -Dtest=SecurityTest
```

### Run Test Suite
```bash
mvn test -Dtest=TestSuite
```

### Run with Coverage Report
```bash
mvn test jacoco:report
```

## Test Dependencies

The test suite uses:
- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework for unit tests
- **Testcontainers** - MongoDB container for integration tests
- **AssertJ** - Fluent assertions
- **REST Assured** - API testing
- **Spring Boot Test** - Spring testing utilities

## Test Data

Test data is generated using `TestDataBuilder` utility class located at:
- `src/test/java/com/eventcraft/EventCraft/util/TestDataBuilder.java`

## Test Configuration

Test configuration is provided by:
- `src/test/java/com/eventcraft/EventCraft/config/TestConfig.java`

## MongoDB Testcontainers

Integration tests use Testcontainers to spin up a real MongoDB instance. This ensures:
- Real database behavior testing
- No need for external MongoDB setup
- Isolated test environments
- Consistent test execution

## Test Execution Flow

1. **Unit Tests** - Fast, isolated service layer tests
2. **Repository Tests** - Database integration tests with Testcontainers
3. **Controller Tests** - API endpoint tests with MockMvc
4. **End-to-End Tests** - Complete business flow automation
5. **Security Tests** - Security and vulnerability testing

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- All tests are automated
- No manual intervention required
- Tests are isolated and can run in parallel
- MongoDB is automatically provisioned via Testcontainers

## Test Reports

After running tests, reports are generated in:
- `target/surefire-reports/` - Test execution reports
- `target/site/jacoco/` - Code coverage reports (if jacoco plugin is configured)

## Best Practices

1. **Isolation**: Each test is independent and can run in any order
2. **Cleanup**: Tests clean up after themselves
3. **Realistic Data**: Test data mimics real-world scenarios
4. **Comprehensive Coverage**: All major flows and edge cases are tested
5. **Security Focus**: Security tests ensure application safety

## Troubleshooting

### MongoDB Container Issues
If Testcontainers fails to start MongoDB:
- Ensure Docker is running
- Check Docker permissions
- Verify network connectivity

### Test Failures
- Check test logs in `target/surefire-reports/`
- Verify MongoDB connection in integration tests
- Ensure all dependencies are properly installed

## Future Enhancements

Potential additions:
- Performance/load tests
- Contract tests
- Mutation testing
- Visual regression tests (if UI is added)
- API contract tests with Pact

