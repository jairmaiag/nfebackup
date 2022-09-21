# build image
build: 
	docker build -t nfebackup .

# run container with image
run:
	docker run -it --env-file .env -p 3001:3001 --name nfebackup nfebackup

# remove container
rm:
	docker rm nfebackup

# remove image
rmi:
	docker rmi nfebackup

# up service
up:
	docker-compose up -d