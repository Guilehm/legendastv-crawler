DOCKER_COMPOSE=docker-compose


run:
	@echo "Starting containers"
	-$(DOCKER_COMPOSE) up


stop:
	@echo "Stopping containers"
	-$(DOCKER_COMPOSE) stop


down:
	@echo "Stopping containers"
	-$(DOCKER_COMPOSE) down -v


build:
	@echo "Stopping containers"
	-$(DOCKER_COMPOSE) up --build
