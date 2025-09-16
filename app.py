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

def ask_question(query):
    global vectorstore
    if not vectorstore:
        return "⚠️ 먼저 교범 PDF를 업로드하세요."

    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0, openai_api_key=OPENAI_API_KEY)

    qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=True)
    result = qa({"query": query})

    answer = result["result"]
    sources = "\n".join([f"- {doc.metadata.get('source','(PDF)')} p.{doc.metadata.get('page','?')}" for doc in result["source_documents"]])

    return f"### 💬 답변\n{answer}\n\n---\n📖 **출처**\n{sources}"

with gr.Blocks() as demo:
    gr.Markdown("# 🐯 AITiger - 군사교범 분석 AI 부관")

    with gr.Row():
        pdf_input = gr.File(label="📄 교범 PDF 업로드", file_types=[".pdf"])
        upload_btn = gr.Button("지식베이스 구축")

    status = gr.Textbox(label="상태 메시지")

    query = gr.Textbox(label="질문 입력", placeholder="")
    answer = gr.Markdown()

    upload_btn.click(build_knowledge_base, inputs=pdf_input, outputs=status)
    query.submit(ask_question, inputs=query, outputs=answer)

demo.launch(server_name="0.0.0.0", server_port=7860)
