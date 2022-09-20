build: 
	docker build -t nfebackup .

run:
	docker run -it --rm --env-file .env -p 3001:3001 --name nfebackup nfebackup

rm:
	docker rm nfebackup

up:
	docker-compose up -d