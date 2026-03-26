# 🚀 DataFlow Graph System

A **Graph-Based Data Modeling and AI Query System** that transforms structured business data into an interactive graph and enables natural language querying using an LLM.

---

## 📌 Project Description

In modern business systems, data is fragmented across multiple tables such as orders, deliveries, invoices, and payments. This project solves that problem by:

- Converting relational data into a **connected graph**
- Providing a **visual interface** to explore relationships
- Enabling **natural language queries** through an AI-powered chat system

---

## 🎯 Objective

To build a system where users can:

- Explore business data visually as a graph
- Understand relationships between entities
- Ask questions in plain English
- Get accurate, data-backed responses

---

## 🧠 Features

### 🔹 Graph Construction

- Converts dataset into nodes and edges
- Represents relationships like:
  - Customer → Order
  - Order → Product
  - Order → Delivery
  - Delivery → Invoice
  - Invoice → Payment

---

### 🔹 Graph Visualization

- Interactive graph UI
- Expand and inspect nodes
- View relationships between entities

---

### 🔹 Conversational Query Interface

- Chat-based input
- Natural language → SQL conversion
- Returns real data responses

---

### 🔹 Guardrails

- Restricts queries to dataset scope
- Rejects unrelated questions

---

## 🏗️ Architecture

```text
Dataset → Database → Graph Builder → API → Frontend → AI Query Engine → Response
```

---

## ⚙️ Tech Stack

### Frontend

- React.js
- Cytoscape.js
- Axios

### Backend

- Node.js
- Express.js

### Database

- SQLite

### AI Integration

- Groq API / Google Gemini

---

## 📊 Dataset

Includes:

### Core Entities

- Orders
- Deliveries
- Invoices
- Payments

### Supporting Entities

- Customers
- Products
- Address

---

## 🔗 Graph Model

### Nodes

- Customer
- Order
- Product
- Delivery
- Invoice
- Payment

### Edges

- Customer → Order
- Order → Product
- Order → Delivery
- Delivery → Invoice
- Invoice → Payment

---

## 💬 Example Queries

- Which products have the highest number of invoices?
- Show all orders for a specific customer
- Find orders that are delivered but not billed
- Trace full lifecycle of an order

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<AASHIF2004>/dataflow-graph-system.git
cd dataflow-graph-system
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
node server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 4️⃣ Environment Variables

Create `.env` file inside backend:

```env
API_KEY=your_api_key_here
```

---

## 🧪 How AI Query Works

1. User enters query in chat
2. System sends query to LLM
3. LLM converts → SQL query
4. Backend executes SQL
5. Results returned as response

---

## 🛡️ Guardrails Example

```js
if (!query.includes("order") && !query.includes("invoice")) {
  return "This system is designed to answer dataset-related queries only.";
}
```

---

## 📦 Deployment

- Frontend → Vercel
- Backend → Render

---



## 🤖 AI Usage

AI tools were actively used in development:

- ChatGPT
- GitHub Copilot

Used for:

- Code generation
- Debugging
- Query logic design

AI session logs are included in submission.

---

## 📊 Evaluation Focus

This project demonstrates:

- Graph modeling skills
- Backend + frontend integration
- AI-powered query handling
- Clean architecture and reasoning

---

## 👨‍💻 Author

**Aashif Shaikh**

---

## 📌 Note

This project is developed as part of a technical assessment to demonstrate problem-solving, system design, and effective use of AI tools.

---
