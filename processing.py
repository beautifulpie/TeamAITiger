import os
import re
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document


def extract_manual_title(docs):
    """
    첫 페이지에서 교범명(제목) 추출. (예: 첫 줄)
    """
    if docs and hasattr(docs[0], 'page_content'):
        lines = docs[0].page_content.splitlines()
        for line in lines:
            if len(line.strip()) > 3:
                return line.strip()
    return "군사교범"


def split_by_structure(docs, openai_api_key=None):
    """
    LLM을 활용해 군사교범 구조별로 분할
    :param docs: LangChain 문서 리스트
    :param openai_api_key: OpenAI API 키 (필수)
    :return: 구조별 chunk 리스트 (section, content, page)
    """
    if openai_api_key is None:
        raise ValueError("openai_api_key must be provided for LLM 기반 분할.")
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0, openai_api_key=openai_api_key)
    chunks = []
    for doc in docs:
        text = doc.page_content
        page = doc.metadata.get('page', '?')
        prompt = (
            "아래 텍스트를 군사교범의 구조별로 분할해 주세요. "
            "각 구조별로 JSON 배열 원소로 section(구조명), content(내용)만 포함해 반환하세요.\n"
            f"텍스트:\n{text}\n"
            "JSON: "
        )
        response = llm.invoke(prompt)
        # LLM 응답에서 JSON 파싱
        import json
        try:
            parsed = json.loads(response)
            for item in parsed:
                section = item.get('section', '').strip()
                content = item.get('content', '').strip()
                if content:
                    chunks.append({
                        'section': section,
                        'content': content,
                        'page': page
                    })
        except Exception:
            # LLM 응답이 JSON이 아닐 경우 전체를 하나의 chunk로 처리
            chunks.append({
                'section': '',
                'content': text,
                'page': page
            })
    return chunks


def pdf_to_vectorstore(pdf_file, openai_api_key):
    """
    군사교범 PDF를 읽어 구조 기반 분할 및 메타데이터 부여 후 벡터DB(FAISS)로 변환합니다.
    :param pdf_file: 파일 객체 (ex. Gradio File 컴포넌트 등)
    :param openai_api_key: OpenAI API 키
    :return: FAISS 벡터스토어 객체
    """
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(pdf_file.read())
        tmp_path = tmp.name

    loader = PyPDFLoader(tmp_path)
    docs = loader.load()

    manual_title = extract_manual_title(docs)
    structured_chunks = split_by_structure(docs)

    langchain_chunks = []
    for chunk in structured_chunks:
        metadata = {
            'source': manual_title,
            'section': chunk['section'],
            'page': chunk['page']
        }
        langchain_chunks.append(Document(page_content=chunk['content'], metadata=metadata))

    # 구조 인식이 안되면 일반 텍스트 분할로 fallback
    if not langchain_chunks:
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        langchain_chunks = splitter.split_documents(docs)
        for doc in langchain_chunks:
            doc.metadata['source'] = manual_title

    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
    vectorstore = FAISS.from_documents(langchain_chunks, embedding=embeddings)

    os.remove(tmp_path)
    return vectorstore
