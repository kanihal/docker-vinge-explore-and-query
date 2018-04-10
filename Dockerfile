FROM tomcat:7
# main tomcat installed in /usr/local/tomcat

MAINTAINER "Jagadeesha Kanihal <jagadkanihal@gmail.com>"

RUN apt-get update && apt-get install -y graphviz

