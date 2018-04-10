FROM tomcat:7
# main tomcat installed in /usr/local/tomcat

MAINTAINER "Jagadeesha Kanihal <jagadkanihal@gmail.com>"

RUN apt-get update && apt-get install -y apt-utils graphviz

#ADD conf/tomcat-users.xml /usr/local/tomcat/conf
#ADD conf/settings.xml /usr/local/tomcat/conf
