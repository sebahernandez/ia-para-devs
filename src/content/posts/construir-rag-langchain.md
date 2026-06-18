---
title: "Construir un sistema RAG con LangChain en Python: de cero a producción"
description: "Tutorial completo para construir recuperación aumentada generativa. Cargamos documentos, generamos embeddings, indexamos en Chroma y construimos la cadena de QA. Con variantes para escalar a producción."
pubDate: 2025-07-28
author: "Equipo Blog IA"
tags: ["langchain", "rag", "python", "tutorial"]
category: tutorial
---

RAG (Retrieval-Augmented Generation) es el patrón más usado para dar acceso a un LLM a información que no está en sus datos de entrenamiento. Este tutorial cubre la implementación completa desde cero.

## Instalación

```bash
pip install langchain langchain-openai langchain-community chromadb pypdf
```

## Paso 1: Cargar documentos

```python
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Cargar PDFs de un directorio
loader = DirectoryLoader('./documentos', glob="**/*.pdf", loader_cls=PyPDFLoader)
documents = loader.load()

print(f"Cargados {len(documents)} documentos")

# Dividir en chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", ".", " "]
)

chunks = text_splitter.split_documents(documents)
print(f"Generados {len(chunks)} chunks")
```

## Paso 2: Generar embeddings e indexar

```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Crear el índice vectorial (persiste en disco)
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

print("Indexación completada")
```

## Paso 3: Construir el retriever

```python
retriever = vectorstore.as_retriever(
    search_type="mmr",  # Maximal Marginal Relevance: diversifica los resultados
    search_kwargs={
        "k": 5,           # Número de documentos a recuperar
        "fetch_k": 20,    # Candidatos a evaluar antes de seleccionar k
    }
)
```

## Paso 4: La cadena RAG completa

```python
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(model="gpt-4o", temperature=0)

prompt_template = """Usa el siguiente contexto para responder la pregunta. 
Si no encuentras la respuesta en el contexto, di explícitamente que no tienes esa información.

Contexto:
{context}

Pregunta: {question}

Respuesta:"""

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs={"prompt": PROMPT}
)

# Hacer una consulta
result = qa_chain.invoke({"query": "¿Cuál es la política de devoluciones?"})

print("Respuesta:", result["result"])
print("\nFuentes:")
for doc in result["source_documents"]:
    print(f"  - {doc.metadata.get('source', 'desconocido')}, página {doc.metadata.get('page', '?')}")
```

## Versión con LangChain Expression Language (LCEL)

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | PROMPT
    | llm
    | StrOutputParser()
)

respuesta = rag_chain.invoke("¿Qué garantías ofrecéis?")
print(respuesta)
```

## Cargar el índice existente (sin re-indexar)

```python
# En el próximo arranque, carga sin recalcular embeddings
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)
```

## Para producción: pasar a Qdrant o Pinecone

```python
from langchain_community.vectorstores import Qdrant

# Reemplazar Chroma por Qdrant sin cambiar nada más
vectorstore = Qdrant.from_documents(
    documents=chunks,
    embedding=embeddings,
    url="http://localhost:6333",
    collection_name="mi_coleccion"
)
```

---

*Fuentes: Documentación oficial de LangChain, guías de integración de Chroma y Qdrant.*
