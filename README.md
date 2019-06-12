# docker-vinge-explore-and-query

Usage instructions

1. clone this repo, cd into the repository

```
git clone https://github.com/kanihal/tomcat_vinge/
cd tomcat_vinge
```

2. modify the rootURI param value (that you would enter in the browser for accessing this applet) in 
`webapps/ExploreAndQuery/WEB-INF/web.xml`
```
        <init-param > 
            <param-name >rootURI</param-name > 
            <param-value >http://10.129.3.103:8081/ExploreAndQuery</param-value > 
        </init-param >  
 ```
 for eg: if you are running on your local machine  you could use `http://127.0.0.1:8081` or `http://localhost:8081`
 
 
3. build docker image
```
sudo docker build -t tomcat_vinge .
```

4. execute 
```
sudo ./run.sh 
```

### How to use
Watch this video -> https://www.youtube.com/watch?v=lmmJISXkNP0


Vinge Software Website - http://www.vingefree.com/explorequery/

For more configuration options, please take a look at - `webapps/ExploreAndQuery/InstallationandConfiguration.pdf`
