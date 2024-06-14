# 실시간 사이드뷰 플랫폼 점프 액션 게임

이 프로젝트는 HTML5, CSS, 그리고 JavaScript를 사용하여 개발된 실시간 사이드뷰 플랫폼 점프 액션 게임입니다. 플레이어는 점프키를 조작하여 장애물을 피하고 아이템을 수집하며, 스테이지가 진행될수록 난이도가 증가합니다.

## 파일 구조
├── assets // 게임 데이터
│ ├── item.json
│ ├── item_unlock.json
│ └── stage.json
├── package-lock.json
├── package.json
├── public // 프론트엔드
│ ├── index.html
│ ├── styles.css
│ └── app.js
├── readme.md
└── src // 서버 코드
├── app.js
├── constants.js
├── handlers // 비즈니스 로직
│ ├── game.handler.js
│ ├── handlerMapping.js // (현재 비어있음)
│ ├── helper.js
│ ├── register.handler.js
│ └── stage.handler.js // (현재 비어있음)
├── init // 초기 데이터 및 로드 기능
│ ├── assets.js
│ └── socket.js
└── models // 세션 모델 관리
├── stage.model.js // (현재 비어있음)
└── user.model.js // (현재 비어있음)

