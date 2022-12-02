# GOOOGLE - WebSearchEngine
This project is focused on building and implementing a web search engine with an emphasis on software architecture and design.


Team Website URL : http://vxa200020.epizy.com/ 


Github Repository: https://github.com/AbhishekDua7/WebSearchEngine


Prelimary Project Report: https://docs.google.com/document/d/1RvcArJRO-8xa4kF4EpGWex4whU0QLqCL-qDSC1tqAAM

### Instruction to Run the project

The project uses the spring boot in JAVA and typescript for front-end. 
Make sure to have the following dependencies in your system
- Maven 2+
- Java 8+
- Any IDE that supports java 
- Node.js or visual studio for typescript [(TypeScript setup)](https://www.typescriptlang.org/download)

Once the following dependencies are loaded in the system.

#### Running the project

Open the terminal pointing to WebSearchEngine directory and run the following
```mvn
mvn clean spring-boot:run
```

Once the spring boot tomcat is started

Open the `/src/main/resources/static/index2.html`

Post performing the action on the page you can see the logs/response stored under the directory
`/src/output/` as `.txt` files.

While making any changes in typescript files make sure to generate the js file as mention in setup.
Helpful command posted below: (Ensure you have downloaded the tsc package)

```typescript 
tsc app.ts
```

#### Debugging/ Testing
- You can setup remote debugger for Java and js code testing.
- Alternatively you can test api for Java using postman tool. 
  - Download the postman tool.
  - Create a new post request
  - Add the api for e.g. http://localhost:8080/query/search/and  . Here search is the api we are testing.
  - In the body tab of postman add the required text. The setting will be set to raw. (Text)
  - Hit Send button.



