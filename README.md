# DangBBun-Server

# 서비스

---

서비스명 : 당뻔
서비스 한 줄 소개 : 번개를 당당하게 열고, 뻔뻔하게 참여하게 도와주는 서비스

# 각자 개발 담당 부분 및 API 설계

---

[https://hospitable-tent-e07.notion.site/API-a9a7728c771e4f5aab5a45852f698929](https://www.notion.so/API-a9a7728c771e4f5aab5a45852f698929)

# 코드 컨벤션

---

- .eslint.rc

```jsx
module.exports = {
  env: {
      node: true,
      commonjs: true,
      es2021: true,
  },
  extends: ["eslint:recommended", "eslint-config-prettier"],
  parserOptions: {
      ecmaVersion: 12,
  },
  rules: {
      "no-prototype-builtins": "off",
      "no-self-assign": "off",
      "no-empty": "off",
      "no-case-declarations": "off",
      "consistent-return": "off",
      "arrow-body-style": "off",
      camelcase: "off",
      quotes: "off",
      "no-unused-vars": "off",
      "comma-dangle": "off",
      "no-bitwise": "off",
      "no-use-before-define": "off",
      "no-extra-boolean-cast": "off",
      "no-empty-pattern": "off",
      curly: "off",
      "no-unreachable": "off",
  },
};
```

- 응답 형식 일관화를 위해 util.js 활용하고 status code와 response message 상수화하기
- var 사용하지 않고, const와 let 이용하기
- 들여쓰기는 공백 2칸으로 하기
- commit하기 전에 prettier로 검사하기

# 브랜치 전략

---

- 개발할 API에 대해 이슈 생성

```
// HTTP메서드 URI
POST /meeting/:meetingId
```

- 이슈번호로 브랜치 생성

```
// feat/#이슈번호
feat/#1
```

- main에 pull request

# 프로젝트 폴더링

![image](https://user-images.githubusercontent.com/71129059/142736458-db734ab9-e08c-4b37-8a10-c10afa652141.png)

# package.json 
```
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "scripts": {
    "lint": "eslint .",
    "serve": "cross-env NODE_ENV=development firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "cross-env NODE_ENV=production firebase deploy --only functions",
    "logs": "firebase functions:lg"
  },
  "engines": {
    "node": "12"
  },
  "main": "index.js",
  "dependencies": {
    "cookie-parser": "^1.4.5",
    "cors": "^2.8.5",
    "cross-env": "^7.0.3",
    "dayjs": "^1.10.7",
    "dotenv": "^10.0.0",
    "eslint-config-prettier": "^8.3.0",
    "express": "^4.17.1",
    "firebase-admin": "^9.2.0",
    "firebase-functions": "^3.11.0",
    "helmet": "^4.6.0",
    "hpp": "^0.2.3",
    "jsonwebtoken": "^8.5.1",
    "lodash": "^4.17.21",
    "pg": "^8.7.1"
  },
  "devDependencies": {
    "eslint": "^7.6.0",
    "eslint-config-google": "^0.14.0",
    "firebase-functions-test": "^0.2.0"
  },
  "private": true
}
```
# ERD
![image](https://user-images.githubusercontent.com/42895142/142743516-8dbc6648-71d4-48e8-b9b6-f129ac1c6db1.png)

# Datagrip에서 생성한 Table 정의
### meeting
![image](https://user-images.githubusercontent.com/42895142/142743572-8f627802-b2d5-4c17-8fa3-881cba7286a1.png)
### participation
![image](https://user-images.githubusercontent.com/42895142/142743561-3f55abd9-1e15-47de-a323-57ea05a71db0.png)
### user
![image](https://user-images.githubusercontent.com/42895142/142743551-230de314-8b1b-4887-a074-ba84c6ca78ed.png)
