up:
	docker compose up --build -d

down:
	docker compose down

reset:
	docker compose down -v

migrate:
	docker compose exec api npx prisma migrate dev --name init

seed:
	docker compose exec api npx prisma db seed

studio:
	docker compose exec api npx prisma studio --port 5555

dev:
	docker compose exec api npm run start:dev

sh:
	docker compose exec api sh

prune:
	docker system prune -a  

docker_stop:
	docker stop $(docker ps -aq)

reset_api:
	docker compose stop api
	docker compose rm -f api

reset_db:
	docker compose stop db
	docker compose rm -f db
	docker volume rm -f nest_rbac_pgdata

reset_studio:
	docker compose stop studio
	docker compose rm -f studio
