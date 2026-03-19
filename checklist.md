# 1:1 문의하기 페이지 개발 체크리스트

## 1. UI 컴포넌트 준비

- [x] Textarea 컴포넌트 생성 (`components/ui/Textarea.tsx`)
- [x] Checkbox 컴포넌트 생성 (`components/ui/Checkbox.tsx`)
- [x] FileUpload 컴포넌트 생성 (`components/ui/FileUpload.tsx`)
- [x] Select 컴포넌트에 placeholder/required/error prop 추가
- [x] Input 컴포넌트에 required prop 추가

## 2. 스타일 작성

- [x] 폼 필드 통합 스타일 (`_form-fields.scss`) — Input/Select/Textarea/Checkbox/FileUpload 포함
- [x] 1:1 문의 페이지 스타일 (`_support-page.scss`)
- [x] main.scss에 새 스타일 import 추가

## 3. 데이터 구성

- [x] `data/supportData.json` 생성 (폼 라벨/placeholder/옵션/에러메시지/SEO)
- [x] `data/index.ts`에 supportData export 추가

## 4. 페이지 / 컨테이너 구성

- [x] `components/support/TicketForm.tsx` 구현
- [x] `components/containers/TicketContainer.tsx` 구현
- [x] `app/(site)/support/tickets/new/page.tsx` 구현 (Metadata API 포함)

## 5. SEO / A11y 점검

- [x] Metadata API로 title/description/OG 설정
- [x] 시맨틱 마크업 확인 (main/section/h1)
- [x] 폼 label-input 연결 확인 (htmlFor/id 매칭)
- [x] aria-describedby 에러/힌트 연결 확인
- [x] 키보드 접근성 확인 (button/input/select/textarea)
- [x] aria-required 필수 필드 표시
- [x] aria-expanded 개인정보 동의 토글
- [x] role="alert" 에러 메시지

## 6. 빌드 검증

- [x] TypeScript 타입 체크 통과 (`npx tsc --noEmit`)
