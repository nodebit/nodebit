FROM ubuntu:latest

# starting here
RUN apt-get update
RUN apt-get install -y git-core curl

# based on nodejs installation instructions at https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions  
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

# mongo install based on instructions at https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
RUN apt-get update
RUN apt-get install -y mongodb-org
RUN mkdir -p /data/db

RUN apt-get install -y python build-essential

RUN mkdir /app
WORKDIR /app
RUN git clone https://github.com/nodebit/nodebit
WORKDIR /app/nodebit
RUN npm install
RUN chmod +x start.sh

EXPOSE 1337
CMD nohup mongod &
ENTRYPOINT ["bash", "start.sh"]
