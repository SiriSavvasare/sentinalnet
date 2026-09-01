# MISSION: BUILD SENTINELNET — AUTONOMOUS CAMPUS THREAT INTELLIGENCE SOC

## 1. PROJECT OVERVIEW & THE CORE PROBLEM
Build SentinelNet: an autonomous threat intelligence and SecOps platform designed for university campuses. Every semester, students are targeted by fraudulent internship, job, modeling, and crypto arbitrage schemes across social media (Instagram, Telegram, WhatsApp). 

### The Core Paradigm Shift (Mentor-Validated Problem):
1. **Administrative Power Constraint:** University administrations cannot force external platforms (Meta, Telegram) to delete scam postings.
2. **The Warning Paradox:** Forwarding raw scam links or handles to students triggers the "curiosity trap." Students click links, which boosts the threat in recommendation algorithms—making the warning itself the exposure vector.
3. **The SentinelNet Dual-Action Solution:**
   - **Air-Gapped Zero-Link Advisories (Students):** De-identified behavioral pattern notices stripped of all clickable links, URLs, and handles.
   - **Platform Abuse Dossiers (Staff/Legal):** Complete forensic packets (telemetry timestamps, Lakehouse hash references, GraphFrames cluster IDs) formatted specifically for Meta/Telegram legal and trust & safety intake desks.

---

## 2. ARCHITECTURE & TECH STACK
- **Frontend (`sentinal.html`):** Dark slate enterprise SOC dashboard (CrowdStrike/Databricks aesthetic), Inter + JetBrains Mono typography, Chart.js for dynamic visualization.
  - **Tab 1: Live Ingress Engine:** CSV stream ingestion, pipeline latency stepper (Ingest -> Mosaic NLP -> Genie Precedent -> Risk Fusion -> Policy Gate), calibrated threat index gauge (0–100), forensic telemetry logs, and Dual-Action Modal dispatchers.
  - **Tab 2: Databricks Genie Agent Space:** Natural language lakehouse query workbench, multi-step agent reasoning trace, dynamic SQL generator, auto-switching chart renderer (line, bar, doughnut), and Delta Lake audit table.
- **Backend (`server.py`):** FastAPI asynchronous bridge running on `http://localhost:8000`.
  - Interfaces with Databricks Genie Space REST API (`01f1a5c7ba2817dba6b30b8bb49c064e`) on workspace `https://dbc-48413daf-cb2e.cloud.databricks.com`.
  - Implements polling logic and semantic synthesis fallback for high-confidence entity resolution and threat modeling.
- **Lakehouse Storage:** Databricks Unity Catalog & Delta Lake (`sentinel_telemetry` table).

---

## 3. THREAT INDEX MATHEMATICAL FORMULA
The threat index $S_{\text{total}} \in [0, 100]$ is computed as:
S_total = min(100, S_ling + S_graph + S_prec + S_base)

- **Linguistic Vector ($S_{\text{ling}} \le 30$):**
  - Tactical Urgency cues (`immediate`, `urgent`, `limited slots`): +14
  - Documentation waiver anomalies (`no paperwork`, `no experience`, `no visa`): +12
  - Upfront fee extortion (`deposit`, `UPI`, `send ₹`, `crypto`): +15
  - Off-platform redirect (`WhatsApp`, `Telegram`): +10
- **Graph Entity Clustering ($S_{\text{graph}} \le 25$):**
  - Contact identifier reused across >1 disparate recruitment campaign: +24
- **Lakehouse Precedent ($S_{\text{prec}} \le 15$):**
  - Confirmed match against historical Delta Lake takedown signatures: +15
- **Baseline Ingress Weight ($S_{\text{base}} = 15$):** Applied to unverified inbound signals.

---

## 4. SAMPLE SEED DATA (`real_scam_telemetry.csv`)
Include a lightweight real-world benchmark feed:
```csv
title,source,text,contact
"Data Entry Clerk & Typing Assistant","TELEGRAM_FEED","Urgent hiring for online remote data processing. ₹500 security registration deposit required via UPI for credentials.","@urgent_campus_gigs"
"Software Engineering Summer Intern","PORTAL_NOTICE","Databricks Bengaluru campus hiring Software Engineer Interns. Apply via official university portal.","placement@bmsce.ac.in"
"Hand & Catalog Model Needed","INSTAGRAM_DM","Immediate start for portfolio shoot. ₹25,000/day. No paperwork or experience required. WhatsApp +91-98765-43210.","+91-98765-43210"
"Global Ambassador - Dubai Tour","WHATSAPP_GROUP","High-paying international student ambassador slot. No visa documentation needed upfront. WhatsApp +91-98765-43210.","+91-98765-43210"
