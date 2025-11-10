# ApiResponseDto 설명

## ApiResponseDto란?

`ApiResponseDto`는 **모든 API 응답의 공통 구조**를 정의하는 제네릭 클래스입니다.

## 왜 필요한가?

### 1. **일관된 API 응답 구조**

모든 API가 동일한 형식으로 응답하면:
- 프론트엔드 개발자가 예측 가능한 구조로 코드 작성 가능
- 에러 처리 로직을 통일할 수 있음
- API 사용자가 이해하기 쉬움

### 2. **현재 구조**

```typescript
export class ApiResponseDto<T> {
  message: string;  // 응답 메시지
  data: T;          // 실제 데이터 (제네릭 타입)
}
```

**예시 응답:**
```json
{
  "message": "공연 목록을 성공적으로 조회했습니다.",
  "data": [
    {
      "mt20id": "PF277653",
      "prfnm": "정선아리랑 토요상설공연: 뗏꾼",
      ...
    }
  ]
}
```

### 3. **제네릭 타입의 장점**

`ApiResponseDto<T>`에서 `<T>`는 **제네릭 타입 파라미터**입니다.

- `ApiResponseDto<PerformanceSummaryDto[]>` → data가 공연 배열
- `ApiResponseDto<MainPerformanceDataDto>` → data가 메인 화면 데이터
- `ApiResponseDto<string>` → data가 문자열

**하나의 클래스로 다양한 타입의 응답을 표현**할 수 있습니다!

### 4. **실제 사용 예시**

#### 예시 1: 공연 목록 조회
```typescript
// 컨트롤러
async findAll(): Promise<ApiResponseDto<PerformanceSummaryDto[]>> {
  return {
    message: '공연 목록을 성공적으로 조회했습니다.',
    data: [/* 공연 배열 */]
  };
}
```

#### 예시 2: 메인 화면 조회
```typescript
// 컨트롤러
async findMainPerformances(): Promise<ApiResponseDto<MainPerformanceDataDto>> {
  return {
    message: '메인 화면 공연 목록을 성공적으로 조회했습니다.',
    data: {
      ranked: [/* 순위별 공연 */],
      byGenre: [/* 장르별 공연 */]
    }
  };
}
```

### 5. **동작 원리**

1. **타입 안정성**: TypeScript가 컴파일 타임에 타입을 체크
   ```typescript
   // ✅ 올바른 사용
   const response: ApiResponseDto<PerformanceSummaryDto[]> = {
     message: "성공",
     data: [/* PerformanceSummaryDto 배열 */]
   };
   
   // ❌ 타입 에러
   const response: ApiResponseDto<PerformanceSummaryDto[]> = {
     message: "성공",
     data: "문자열"  // 에러! 배열이어야 함
   };
   ```

2. **Swagger 문서화**: `@ApiProperty` 데코레이터로 자동 문서 생성
   - Swagger UI에서 응답 구조를 시각적으로 확인 가능
   - 프론트엔드 개발자가 API 스펙을 쉽게 이해

3. **코드 재사용**: 모든 API에서 동일한 구조 사용
   - 새로운 API 추가 시 일관된 패턴 유지
   - 유지보수 용이

### 6. **대안과 비교**

#### ❌ ApiResponseDto 없이 사용한다면?
```typescript
// 각 API마다 다른 구조
async findAll() {
  return { performances: [...] };  // 구조 1
}

async findMain() {
  return { ranked: [...], byGenre: [...] };  // 구조 2
}

async findDetail() {
  return { performance: {...} };  // 구조 3
}
```
**문제점:**
- 프론트엔드에서 각 API마다 다른 방식으로 처리해야 함
- 에러 처리 로직이 분산됨
- 일관성 없음

#### ✅ ApiResponseDto 사용
```typescript
// 모든 API가 동일한 구조
async findAll(): Promise<ApiResponseDto<PerformanceSummaryDto[]>> {
  return { message: "...", data: [...] };
}

async findMain(): Promise<ApiResponseDto<MainPerformanceDataDto>> {
  return { message: "...", data: { ranked: [...], byGenre: [...] } };
}
```
**장점:**
- 프론트엔드에서 통일된 방식으로 처리
- 에러 처리 로직 통합 가능
- 일관성 유지

## 요약

`ApiResponseDto<T>`는:
1. **일관된 API 응답 구조** 제공
2. **제네릭 타입**으로 다양한 데이터 타입 지원
3. **타입 안정성** 보장
4. **Swagger 문서화** 자동화
5. **코드 재사용성** 향상

결론: **API 응답의 표준화와 타입 안정성을 위한 필수적인 구조**입니다!

