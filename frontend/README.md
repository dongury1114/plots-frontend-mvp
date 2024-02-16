# Next.js 프로젝트

이 프로젝트는 Next.js를 사용하여 구축된 웹 애플리케이션입니다. FastAPI를 백엔드로 사용하며, React 기반의 서버 사이드 렌더링을 통해 뛰어난 사용자 경험과 SEO 성능을 제공합니다.

## 시작하기

이 지침을 따라 프로젝트를 로컬 환경에서 실행할 수 있습니다.

### 사전 요구 사항

- Node.js (nvm을 사용하여 최신 버전 설치)
- npm

### Node.js 버전 관리 (nvm 사용)

nvm을 사용하여 Node.js의 특정 버전을 설치하고 관리할 수 있습니다. nvm이 설치되어 있지 않다면, [nvm GitHub 페이지](https://github.com/nvm-sh/nvm)의 설치 지침을 따라 설치하세요.

1. nvm을 사용하여 Node.js의 최신 버전을 설치합니다:

    ```bash
    nvm install node
    ```

2. 최신 버전으로 전환합니다:

    ```bash
    nvm use node
    ```

3. 사용 중인 Node.js 버전을 확인합니다:

    ```bash
    node --version
    ```

### 설치

1. 프로젝트를 클론합니다:

    ```bash
    git clone <repository-url>
    ```

2. 프로젝트 디렉터리로 이동합니다:

    ```bash
    cd <repository-path>
    ```

3. 필요한 패키지를 설치합니다:

    npm을 사용

    ```bash
    npm install
    ```

### 개발 서버 실행

개발 서버를 시작하려면 다음 명령어를 사용하세요:

    npm을 사용
```bash
npm run dev
```

서버가 시작되면 http://localhost:3000을 통해 애플리케이션에 접근할 수 있습니다.

