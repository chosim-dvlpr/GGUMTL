# Building the Future Through Dreams, GGUMTL


### 1️⃣ Project Overview


📌 **Development Period**

Duration: 2023.08.28 - 2023.10.06 (6 weeks)

<br/>

📌 **Team Members**

| Member | Role | 
| --- | --- |
| Sunjin Kim |	Team Lead, Backend, Infrastructure, Algorithms |
| Bumseon Choi | Backend, Data Storage |
| Yunyeong Hwang | Backend |
| Minji Byun | 	Frontend, Data Crawling |
| Eunseok Lee | Frontend |
| Dongmin Shin | Frontend, Data Processing, Image Generation |

<br/>

📌 **Project Purpose**

Dreams serve as a window into the subconscious!
Can we create a better day by analyzing these dreams?

<br/>

📌 **Goals**

- Analyze and interpret user-submitted dreams, generating corresponding images.
- Host auctions for generated dream images, allowing users to exchange dreams.
- Recommend "daydreams" (challenges) based on keywords extracted from dreams.
- Encourage motivation through shared challenges with other users.

<br/>

### 2️⃣ Service Introduction
📌 **Key Feature: Dream Analysis**

- Input dream data via voice or text
- Identify the closest matching dream in the existing dataset
- Use weights such as text similarity and sentiment analysis
<br/>
📌 **Key Feature: Dream Cards**

- Extract keywords based on submitted dream text
- Generate images with the generative AI model, Carlo, using extracted keywords
- Provide "positive dream" and "rarity" scores for dream cards
<br/>
📌 **Key Feature: Dream Card Auction**

- Exchange generated dream cards with other users
<br/>
📌 **Key Feature: Challenges**

- Achieve goals together by participating in challenges
- Register daily verification posts
- Interact with likes and comments

<br/>

### 3️⃣ Architecture

![시스템아키텍처](etc/img/시스템아키텍처.png)


<br/>

### 4️⃣ Tech Stack


- Back-End
  - Java
  - Spring Boot
  - Spring JPA
  - Spring Security
  - Stomp
  - JWT
  - OAuth2
- Front-End
  - React
  - Redux
  - Redux-Persist
  - TypeScript
  - Node.js
  - Axios
  - Stomp.js
  - Styled-components
- Data
  - Python
  - BeautifulSoup
  - Selenium
  - Fast API
  - KoNLPY
  - Google-cloud-language
  - Karlo
- Infra
  - Docker
  - Ngnix
  - Jenkins
  - Amazon S3
- DB
  - MySQL
  - MongoDB
  - Redis
- Team Collaboration Tool
  - Gitlab
  - Jira
  - Notion
  - Figma
  - Mattermost
  - Webex

<br/>

### 5️⃣ ERD

![ERD](etc/img/ERD.png)

<br/>

### 6️⃣ API Documentation

![API명세](etc/img/API명세.png)

<br/>

### 7️⃣ Service Screens


- Landing Page<br>
![Landing Page](etc/img/메인.png)

<br>

- Auctions<br>
![Auctions](etc/img/경매.png)

<br>

- Challenges<br>
![Challenges](etc/img/챌린지.png)

