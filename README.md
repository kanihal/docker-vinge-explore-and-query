# tomcat_vinge

usage instructions

1. clone this repo, cd into the repo

```
git clone https://github.com/kanihal/tomcat_vinge/
cd tomcat_vinge
```

2. modify the rootURI param value (that you would enter in the browser for accessing browser) in 
`webapps/ExploreAndQuery/WEB-INF/web.xml`
```
        <init-param > 
            <param-name >rootURI</param-name > 
            <param-value >http://10.129.3.103:8081/ExploreAndQuery</param-value > 
        </init-param >  
 ```
 
3. 
```
sudo docker build -t tomcat_vinge .
```

4. execute 
```
sudo ./run.sh 
```
