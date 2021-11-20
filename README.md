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

---


![image](https://user-images.githubusercontent.com/42895142/142736396-050aaabe-8fd0-46f7-897a-ddac30ac5bb8.png)
