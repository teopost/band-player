.PHONY: rebuild rebuild-dev

rebuild:
	docker compose up -d --build

rebuild-dev:
	docker compose -f compose-dev.yaml up -d --build

