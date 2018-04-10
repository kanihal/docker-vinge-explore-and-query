#/bin/bash
#sudo docker-compose up

#start the container 
sudo docker run -d \
    --name tomcat_vinge\
    --restart=always \
    -p 8081:8080 \
    -v  ${PWD}/conf:/usr/local/tomcat/conf \
    -v  ${PWD}/webapps/ExploreAndQuery:/usr/local/tomcat/webapps/ExploreAndQuery \
    tomcat_vinge