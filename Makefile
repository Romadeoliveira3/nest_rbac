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

docker_stop:
	docker stop $(docker ps -a)
	docker rm $(docker ps -a)
	docker volume rm $(docker volume ls -q)
	docker network rm $(docker network ls -q)
	docker rmi $(docker images -q)

prune:
	docker system prune -a