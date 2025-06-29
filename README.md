# 🎬 UOS 영화 예매 시스템

<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript)
![Styled Components](https://img.shields.io/badge/Styled%20Components-6.1.18-DB7093?style=for-the-badge&logo=styled-components)
![React Router](https://img.shields.io/badge/React%20Router-7.6.0-CA4245?style=for-the-badge&logo=react-router)

**🎭 영화 예매부터 좌석 선택까지, 모든 것을 한 곳에서!**

</div>

---

## 🌟 프로젝트 소개

안녕하세요! 👋 **UOS 영화 예매 시스템**에 오신 것을 환영합니다! 🎉

이 프로젝트는 영화를 사랑하는 모든 분들을 위해 만들어진 웹 애플리케이션입니다. 
영화 검색부터 예매, 좌석 선택까지 모든 과정을 아름답고 직관적인 인터페이스로 제공해요! ✨

### 🎯 주요 기능

- 🎬 **영화 검색 및 상세 정보** - 최신 영화 정보를 한눈에!
- 🎫 **실시간 예매 시스템** - 원하는 날짜와 시간에 예매하세요
- 🪑 **좌석 선택** - 마음에 드는 자리를 골라보세요
- 👤 **회원 관리** - 개인정보와 예매 내역을 안전하게 관리
- 🎭 **관리자 기능** - 영화관, 스케줄, 예매 현황 관리
- 💳 **결제 시스템** - 안전하고 편리한 결제

---

## 🚀 시작하기

### 📋 필수 요구사항

- Node.js (v14 이상)
- npm 또는 yarn

### ⚡ 빠른 시작

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/UOS-ticket-reservation-frontend.git

# 2. 프로젝트 폴더로 이동
cd UOS-ticket-reservation-frontend

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npm start
```

🎉 **완료!** 이제 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요!

---

## 🛠️ 사용된 기술 스택

<div align="center">

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| **프론트엔드** | React | 19.1.0 |
| **언어** | TypeScript | 4.9.5 |
| **스타일링** | Styled Components | 6.1.18 |
| **라우팅** | React Router DOM | 7.6.0 |
| **아이콘** | React Icons | 5.5.0 |
| **HTTP 클라이언트** | Axios | 1.9.0 |

</div>

---

## 📁 프로젝트 구조

```
src/
├── 📁 components/          # 재사용 가능한 컴포넌트들
│   ├── 🎬 MovieCard.tsx    # 영화 카드 컴포넌트
│   ├── 🎫 ReserveSeat.tsx  # 좌석 선택 컴포넌트
│   ├── 🔍 SearchBar.tsx    # 검색바 컴포넌트
│   └── ...                 # 기타 컴포넌트들
├── 📁 pages/               # 페이지 컴포넌트들
│   ├── 🏠 Home.tsx         # 메인 홈페이지
│   ├── 🎭 MovieDetail.tsx  # 영화 상세 페이지
│   ├── 🎫 ReservePage.tsx  # 예매 페이지
│   ├── 👤 Mypage.tsx       # 마이페이지
│   └── 📁 admin/           # 관리자 페이지들
├── 📁 contexts/            # React Context
│   └── 🔐 AuthContext.tsx  # 인증 컨텍스트
├── 📁 types/               # TypeScript 타입 정의
├── 📁 data/                # 정적 데이터
└── 📁 styles/              # 스타일 관련 파일들
```

---

## 🎮 사용법

### 🎬 영화 예매하기

1. **홈페이지**에서 원하는 영화를 찾아보세요
2. **영화 상세 페이지**에서 상영 시간을 확인하세요
3. **예매 페이지**에서 날짜와 시간을 선택하세요
4. **좌석 선택**에서 마음에 드는 자리를 골라보세요
5. **결제**를 완료하면 예매가 완료됩니다! 🎉

### 👤 회원 기능

- **회원가입**: 새로운 계정을 만들어보세요
- **로그인**: 기존 계정으로 로그인하세요
- **마이페이지**: 예매 내역과 개인정보를 관리하세요
- **포인트**: 예매할 때마다 포인트를 적립받으세요

---

## 🛠️ 개발 명령어

```bash
# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test

# 코드 이젝트 (주의: 되돌릴 수 없음)
npm run eject
```

---

## 🎨 스크린샷

<div align="center">

### 🏠 메인 홈페이지
![홈페이지](https://via.placeholder.com/400x250/FF6B6B/FFFFFF?text=🏠+홈페이지)

### 🎭 영화 상세 페이지
![영화 상세](https://via.placeholder.com/400x250/4ECDC4/FFFFFF?text=🎭+영화+상세)

### 🎫 예매 페이지
![예매 페이지](https://via.placeholder.com/400x250/45B7D1/FFFFFF?text=🎫+예매+페이지)

</div>

---

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면 언제든 환영합니다! 🎉

1. 이 저장소를 포크하세요
2. 새로운 브랜치를 만드세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 📞 문의하기

궁금한 점이 있으시다면 언제든 연락주세요! 💌

- 📧 이메일: your-email@example.com
- 🐛 버그 리포트: [Issues](https://github.com/your-username/UOS-ticket-reservation-frontend/issues)
- 💡 기능 제안: [Discussions](https://github.com/your-username/UOS-ticket-reservation-frontend/discussions)

---

<div align="center">

**🎬 영화를 사랑하는 모든 분들을 위해 만들어졌습니다! 🎭**

⭐ 이 프로젝트가 마음에 드셨다면 스타를 눌러주세요! ⭐

</div>
