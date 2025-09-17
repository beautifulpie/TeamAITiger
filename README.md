# TeamAITiger
## 설명
본 repository는 **"2025 육군 빅데이터 분석 경연 대회"** 출품을 위한 repository로써 인공지능 부관 서비스 플랫폼의 코드를 공유하기 위한 저장소입니다.

# 🪖 Military Manual RAG System  
**LangChain 기반 군사교범 분석 시스템**

이 프로젝트는 군사 교범 및 작전 지침과 같은 방대한 군사 지식을 LangChain 기반 파이프라인으로 전처리하고,  
벡터 데이터베이스를 활용한 Retrieval-Augmented Generation(RAG) 기법으로 분석·검색·질의응답 기능을 제공하는 **AI 부관 시스템**의 MVP 구현체입니다.

---

# 🪖 Military Manual RAG System  
**LangChain 기반 군사교범 분석 시스템**

이 프로젝트는 군사 교범 및 작전 지침과 같은 방대한 군사 지식을 LangChain 기반 파이프라인으로 전처리하고,  
벡터 데이터베이스를 활용한 Retrieval-Augmented Generation(RAG) 기법으로 분석·검색·질의응답 기능을 제공하는 **AI 부관 시스템**의 MVP 구현체입니다.

---

## 📌 주요 기능

- 🧠 **LangChain 기반 RAG 파이프라인**
  - 교범·지침 PDF 로드 → 텍스트 분할 → 임베딩 → 벡터 DB 저장
- 📚 **지식베이스 질의응답**
  - 의미 유사도 기반 검색으로 문서 Chunk를 찾아 근거와 함께 응답
- ⚙️ **멀티에이전트 오케스트레이션**
  - 작전, 군수, 정비 등 분야별 도구를 자동 호출하여 복합 질의 처리
- 📊 **실시간 전장 데이터 연동 (확장 예정)**
  - 기상/지형 API, 전력 현황 DB 연동 지원 설계

---

## 📁 시스템 아키텍처

```plaintext
┌────────────┐   ┌──────────────┐   ┌───────────────┐   ┌───────────────┐
│ Document   │ → │ Text         │ → │ Embedding &   │ → │ Vector Store  │
│ Loading    │   │ Splitting    │   │ Metadata      │   │ (FAISS/Milvus)│
└────────────┘   └──────────────┘   └───────────────┘   └───────────────┘
                                                         ↓
                                                  ┌─────────────┐
                                                  │ Retriever   │
                                                  └─────────────┘
                                                         ↓
                                                  ┌─────────────┐
                                                  │ LLM (RAG)   │
                                                  └─────────────┘
```

🛠 설치 및 실행
1. 필수 라이브러리 설치
```bash
git clone https://github.com/beautifulpie/TeamAITiger
cd AITiger
pip install -r requirements.txt
```
requirements.txt 예시
```nginx
코드 복사
langchain
openai
faiss-cpu
pypdf
gradio
```
2. 환경 변수 설정
.env 파일을 생성하여 API Key 등록:
```ini
OPENAI_API_KEY=sk-xxxxxx
```
3. 로컬 서버 실행
```bash
python app.py
```
💻 사용 방법
```
교범 PDF 파일을 업로드합니다.

시스템이 문서를 분할하고 벡터DB에 저장합니다.

질의 입력창에 질문(예: "평지에서 대기 중인 전차의 배치 간격은 얼마인가?")을 입력합니다.

RAG 시스템이 관련 문서 Chunk를 근거와 함께 반환합니다.
```
📌 향후 확장 계획
```
군수·정비·인사 등 처부별 멀티에이전트 도구 연동

전장 실시간 데이터 API 통합

지식 그래프 기반 관계 추론 기능 추가

국방망 배포 환경 지원
