POSTGRES_CONTAINER=postgres_14
POSTGRES_USER=postgres
TEST_DB=imperio_test

db-test-create:
	@echo "Creating test database if not exists..."
	@docker exec $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -tc "SELECT 1 FROM pg_database WHERE datname='$(TEST_DB)'" | grep -q 1 || \
	docker exec $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -c "CREATE DATABASE $(TEST_DB);"

db-test-push:
	@echo "Pushing schema to test database..."
	@npm run db:test:push

db-test-reset:
	@echo "Resetting test database..."
	@npm run db:test:reset

db-test-setup: db-test-create db-test-reset
	@echo "Test database ready."

test:
	@echo "Running tests..."
	@npm run test

test-watch:
	@echo "Running tests in watch mode..."
	@npm run test:watch