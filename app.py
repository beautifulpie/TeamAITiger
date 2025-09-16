import os
import tempfile
import gradio as gr
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY가 .env에 설정되어 있어야 합니다.")

vectorstore = None

def build_knowledge_base(pdf_file):
    global vectorstore

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(pdf_file.read())
        tmp_path = tmp.name

    loader = PyPDFLoader(tmp_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(docs)

    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    vectorstore = FAISS.from_documents(chunks, embedding=embeddings)

    return f"총 {len(chunks)}개 청크를 벡터 DB에 저장했습니다."


# 분야별 라우팅 및 에이전트 함수들
def route_field(query):
    # LLM을 활용한 분야 분류
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0, openai_api_key=OPENAI_API_KEY)
    prompt = (
        "아래 질문이 어떤 군사 분야(작전, 군수, 탄약, 의무)에 해당하는지 한 단어로만 답변하세요. "
        "만약 해당하지 않으면 '일반'이라고 답하세요.\n"
        f"질문: {query}\n"
        "답변: "
    )
    response = llm.invoke(prompt)
    field = response.strip()
    if field not in ["작전", "군수", "탄약", "의무"]:
        field = "일반"
    return field

def operation_agent(query, vectorstore):
    return run_rag(query, vectorstore, "작전")

def logistics_agent(query, vectorstore):
    return run_rag(query, vectorstore, "군수")

def ammo_agent(query, vectorstore):
    return run_rag(query, vectorstore, "탄약")

def medical_agent(query, vectorstore):
    return run_rag(query, vectorstore, "의무")

def default_agent(query, vectorstore):
    return run_rag(query, vectorstore, "일반")

def run_rag(query, vectorstore, field):
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0, openai_api_key=OPENAI_API_KEY)
    qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=True)
    result = qa({"query": f"[{field}] 분야 질문: {query}"})
    answer = result["result"]
    sources = "\n".join([f"- {doc.metadata.get('source','(PDF)')} p.{doc.metadata.get('page','?')}" for doc in result["source_documents"]])
    return f"### 💬 답변\n{answer}\n\n---\n📖 **출처**\n{sources}"

def ask_question(query):
    global vectorstore
    if not vectorstore:
        return "⚠️ 먼저 교범 PDF를 업로드하세요."

    # 분야 판별 및 라우팅
    field = route_field(query)
    if field == "작전":
        return operation_agent(query, vectorstore)
    elif field == "군수":
        return logistics_agent(query, vectorstore)
    elif field == "탄약":
        return ammo_agent(query, vectorstore)
    elif field == "의무":
        return medical_agent(query, vectorstore)
    else:
        return default_agent(query, vectorstore)


    # 분야별 에이전트 예시 (실제 구현은 각 분야별 특화 로직으로 대체 가능)
def operation_agent(query, vectorstore):
    return run_rag(query, vectorstore, "작전")

def logistics_agent(query, vectorstore):
    return run_rag(query, vectorstore, "군수")

def ammo_agent(query, vectorstore):
    return run_rag(query, vectorstore, "탄약")

def medical_agent(query, vectorstore):
    return run_rag(query, vectorstore, "의무")

def default_agent(query, vectorstore):
    return run_rag(query, vectorstore, "일반")

def run_rag(query, vectorstore, field):
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0, openai_api_key=OPENAI_API_KEY)
    qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=True)
    result = qa({"query": f"[{field}] 분야 질문: {query}"})
    answer = result["result"]
    sources = "\n".join([f"- {doc.metadata.get('source','(PDF)')} p.{doc.metadata.get('page','?')}" for doc in result["source_documents"]])
    return f"### 💬 답변\n{answer}\n\n---\n📖 **출처**\n{sources}"

with gr.Blocks() as demo:
    gr.Markdown("# AITiger")

    with gr.Row():
        pdf_input = gr.File(label="📄 교범 PDF 업로드", file_types=[".pdf"])
        upload_btn = gr.Button("지식베이스 구축")

    status = gr.Textbox(label="상태 메시지")

    query = gr.Textbox(label="질문 입력", placeholder="예: 비가 4mm 오는 상황에서, 10 km 외부 지역에 지속성 작용제가 포탄으로 투하시 대처해야 하는가?")
    answer = gr.Markdown()

    upload_btn.click(build_knowledge_base, inputs=pdf_input, outputs=status)
    query.submit(ask_question, inputs=query, outputs=answer)

demo.launch(server_name="0.0.0.0", server_port=7860)
