.PHONY: rebuild rebuild-dev

rebuild-dev:
	docker compose -f compose-dev.yaml up -d --build
	
rebuild:
	docker compose up -d --build


