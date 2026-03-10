#!/usr/bin/env python3
"""Add 50 new products (30 free, 20 paid) across diverse verticals."""

import csv
import os
import random
import string
import urllib.parse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(SCRIPT_DIR, "..")
PRODUCTS_CSV = os.path.join(ROOT, "apps/web/data/products.collection.csv")
FREE_DL_DIR = os.path.join(ROOT, "apps/web/public/downloads")
PAID_DL_DIR = os.path.join(ROOT, "apps/web/public/downloads/paid")

os.makedirs(FREE_DL_DIR, exist_ok=True)
os.makedirs(PAID_DL_DIR, exist_ok=True)

# ─── Color palettes by category ──────────────────────────────────────────────
PALETTES = {
    "prompt": ("1F4D3A", "F0FFF7"),
    "skill": ("3D2E6E", "F5F1FF"),
    "agent": ("7A2E1F", "FFF6F2"),
    "utility": ("1B3A4B", "EFF8FF"),
    "doc": ("5A4A1F", "FFFBEA"),
}


def fake_stripe_url(product_id):
    tag = "".join(random.choices(string.ascii_letters + string.digits, k=14))
    return f"https://buy.stripe.com/{tag}"


def cover_url(name, category):
    bg, fg = PALETTES.get(category, ("2C3748", "F5F8FC"))
    text = urllib.parse.quote(name)
    return f"https://placehold.co/1200x800/{bg}/{fg}.png?text={text}"


# ─── 50 New Products ─────────────────────────────────────────────────────────
# IDs continue from 185 (last existing = 184)

PRODUCTS = [
    # ── FREE PRODUCTS (30): lead_magnet=Y ──────────────────────────────────

    # Free Prompts (12)
    dict(num=185, pid="AA-PRM-EDU-LESSPLAN-185", slug="prompt-lesson-plan-pack", name="Lesson Plan Generator Prompt Pack",
         cat="prompt", sub="prompt_pack", desc="Prompts for generating structured lesson plans across subjects and grade levels",
         price=0, compare=19, tags="education | lesson plans | curriculum | prompts",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=186, pid="AA-PRM-EDU-QUIZCRAFT-186", slug="prompt-quiz-assessment-pack", name="Quiz & Assessment Prompt Pack",
         cat="prompt", sub="prompt_pack", desc="Prompts for auto-generating quizzes, rubrics, and assessment criteria",
         price=0, compare=19, tags="education | quizzes | assessment | prompts",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=187, pid="AA-PRM-HR-JOBDESC-187", slug="prompt-job-description-writer", name="Job Description Writer Prompts",
         cat="prompt", sub="prompt_pack", desc="Prompts for crafting inclusive, structured job descriptions with role requirements",
         price=0, compare=19, tags="HR | job descriptions | recruiting | prompts",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=188, pid="AA-PRM-HR-INTERVIEWKIT-188", slug="prompt-interview-question-pack", name="Interview Question Prompt Pack",
         cat="prompt", sub="prompt_pack", desc="Behavioral and technical interview question generators for hiring teams",
         price=0, compare=19, tags="HR | interviews | hiring | prompts",
         compat="openai | anthropic", intent="TOFU", free=True),

    dict(num=189, pid="AA-PRM-PMG-USERSTORY-189", slug="prompt-user-story-writer", name="User Story Writer Prompt Pack",
         cat="prompt", sub="prompt_pack", desc="Prompts for writing user stories with acceptance criteria and edge cases",
         price=0, compare=19, tags="product management | user stories | agile | prompts",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=190, pid="AA-PRM-PMG-ROADMAP-190", slug="prompt-roadmap-planner-pack", name="Roadmap Planning Prompt Pack",
         cat="prompt", sub="prompt_pack", desc="Prompts for generating quarterly roadmaps with prioritisation frameworks",
         price=0, compare=19, tags="product management | roadmap | planning | prompts",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=191, pid="AA-PRM-SEC-THREATMODEL-191", slug="prompt-threat-model-pack", name="Threat Modeling Prompt Pack",
         cat="prompt", sub="prompt_pack", desc="STRIDE and DREAD-based threat modeling prompts for security reviews",
         price=0, compare=19, tags="security | threat modeling | STRIDE | prompts",
         compat="openai | anthropic", intent="TOFU", free=True),

    dict(num=192, pid="AA-PRM-SEC-AUDITPREP-192", slug="prompt-audit-prep-pack", name="Audit Preparation Prompt Pack",
         cat="prompt", sub="prompt_pack", desc="Prompts for preparing SOC 2, ISO 27001, and GDPR audit documentation",
         price=0, compare=19, tags="security | compliance | audit | SOC 2 | prompts",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=193, pid="AA-PRM-DAT-SQLGEN-193", slug="prompt-sql-query-gen-pack", name="SQL Query Generator Prompts",
         cat="prompt", sub="prompt_pack", desc="Prompts for generating optimised SQL queries from natural language descriptions",
         price=0, compare=19, tags="data | SQL | query generation | analytics | prompts",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=194, pid="AA-PRM-DAT-DATAQUAL-194", slug="prompt-data-quality-check", name="Data Quality Check Prompts",
         cat="prompt", sub="prompt_pack", desc="Prompts for identifying data anomalies, missing values, and schema drift",
         price=0, compare=19, tags="data | quality | validation | analytics | prompts",
         compat="openai | anthropic", intent="TOFU", free=True),

    dict(num=195, pid="AA-PRM-LEGAL-CONTRACTREV-195", slug="prompt-contract-review-starter", name="Contract Review Starter Prompts",
         cat="prompt", sub="prompt_pack", desc="Prompts for clause extraction, risk flagging, and obligation tracking in contracts",
         price=0, compare=19, tags="legal | contracts | review | compliance | prompts",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=196, pid="AA-PRM-HEALTH-DOCNOTE-196", slug="prompt-clinical-doc-pack", name="Clinical Documentation Prompts",
         cat="prompt", sub="prompt_pack", desc="Prompts for structuring clinical notes, discharge summaries, and referral letters",
         price=0, compare=19, tags="healthcare | clinical notes | documentation | prompts",
         compat="openai | anthropic", intent="TOFU", free=True),

    # Free Skills (6)
    dict(num=197, pid="AA-SKL-EDU-RUBRICGEN-197", slug="skill-rubric-generator", name="Rubric Generator Skill",
         cat="skill", sub="skill_module", desc="Skill module for generating grading rubrics from learning objectives",
         price=0, compare=29, tags="education | rubrics | grading | skill",
         compat="openai | anthropic | langchain", intent="MOFU", free=True),

    dict(num=198, pid="AA-SKL-HR-RESUMEPARSE-198", slug="skill-resume-parser", name="Resume Parser Skill",
         cat="skill", sub="skill_module", desc="Skill for extracting structured data from resumes into normalised JSON",
         price=0, compare=39, tags="HR | resume | parsing | extraction | skill",
         compat="openai | anthropic | langchain", intent="MOFU", free=True),

    dict(num=199, pid="AA-SKL-PMG-PRIORANK-199", slug="skill-priority-ranker", name="Priority Ranking Skill",
         cat="skill", sub="skill_module", desc="RICE and WSJF scoring skill for backlog item prioritisation",
         price=0, compare=29, tags="product management | prioritisation | RICE | skill",
         compat="openai | anthropic | cursor", intent="MOFU", free=True),

    dict(num=200, pid="AA-SKL-SEC-VULNSCAN-200", slug="skill-vuln-scanner", name="Vulnerability Scanner Skill",
         cat="skill", sub="skill_module", desc="Skill for scanning code snippets and configs for common vulnerability patterns",
         price=0, compare=39, tags="security | vulnerability | scanning | OWASP | skill",
         compat="openai | anthropic | langchain", intent="MOFU", free=True),

    dict(num=201, pid="AA-SKL-DAT-CSVCLEAN-201", slug="skill-csv-data-cleaner", name="CSV Data Cleaner Skill",
         cat="skill", sub="skill_module", desc="Skill for detecting and fixing common CSV data issues like encoding and delimiters",
         price=0, compare=29, tags="data | CSV | cleaning | transformation | skill",
         compat="openai | anthropic | cursor", intent="MOFU", free=True),

    dict(num=202, pid="AA-SKL-LEGAL-CLAUSEEXT-202", slug="skill-clause-extractor", name="Clause Extraction Skill",
         cat="skill", sub="skill_module", desc="Skill for extracting and categorising key clauses from legal documents",
         price=0, compare=39, tags="legal | clauses | extraction | NLP | skill",
         compat="openai | anthropic | langchain", intent="MOFU", free=True),

    # Free Utilities (7)
    dict(num=203, pid="AA-UTL-EDU-COURSETEMPL-203", slug="utility-course-structure-templates", name="Course Structure Templates",
         cat="utility", sub="utility_module", desc="Templates for organising course modules, objectives, and assessment mapping",
         price=0, compare=19, tags="education | course design | templates | utility",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=204, pid="AA-UTL-HR-ONBOARDFLOW-204", slug="utility-onboarding-flow-templates", name="Onboarding Flow Templates",
         cat="utility", sub="utility_module", desc="Structured onboarding checklists and 30-60-90 day plan templates",
         price=0, compare=19, tags="HR | onboarding | checklists | templates | utility",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=205, pid="AA-UTL-PMG-SPRINTTEMPL-205", slug="utility-sprint-planning-templates", name="Sprint Planning Templates",
         cat="utility", sub="utility_module", desc="Sprint ceremony templates including planning, retro, and standup formats",
         price=0, compare=19, tags="product management | sprint | agile | templates | utility",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=206, pid="AA-UTL-SEC-COMPLMAP-206", slug="utility-compliance-checklist-templates", name="Compliance Checklist Templates",
         cat="utility", sub="utility_module", desc="SOC 2, HIPAA, and GDPR compliance checklist templates in YAML and Markdown",
         price=0, compare=19, tags="security | compliance | SOC 2 | HIPAA | GDPR | utility",
         compat="openai | anthropic", intent="TOFU", free=True),

    dict(num=207, pid="AA-UTL-DAT-ETLTEMPL-207", slug="utility-etl-pipeline-templates", name="ETL Pipeline Templates",
         cat="utility", sub="utility_module", desc="Reusable ETL pipeline configs for common data source integrations",
         price=0, compare=19, tags="data | ETL | pipelines | integration | utility",
         compat="openai | anthropic | langchain", intent="TOFU", free=True),

    dict(num=208, pid="AA-UTL-LEGAL-NDATEMPL-208", slug="utility-nda-agreement-templates", name="NDA & Agreement Templates",
         cat="utility", sub="utility_module", desc="Starter NDA, MSA, and SaaS agreement template scaffolds in Markdown",
         price=0, compare=19, tags="legal | NDA | agreements | contracts | utility",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=209, pid="AA-UTL-HEALTH-INTAKE-209", slug="utility-patient-intake-templates", name="Patient Intake Form Templates",
         cat="utility", sub="utility_module", desc="Structured patient intake and medical history form templates",
         price=0, compare=19, tags="healthcare | intake forms | patient | templates | utility",
         compat="openai | anthropic", intent="TOFU", free=True),

    # Free Docs (5)
    dict(num=210, pid="AA-DOC-EDU-AITEACHING-210", slug="doc-ai-in-teaching-guide", name="AI in Teaching Guide",
         cat="doc", sub="guide", desc="Practical guide for integrating AI tools into classroom instruction and assessment",
         price=0, compare=19, tags="education | AI | teaching | guide",
         compat="openai | anthropic | cursor", intent="TOFU", free=True),

    dict(num=211, pid="AA-DOC-HR-AIRECRUIT-211", slug="doc-ai-recruiting-handbook", name="AI Recruiting Handbook",
         cat="doc", sub="guide", desc="Handbook covering AI-assisted sourcing, screening, and candidate evaluation",
         price=0, compare=19, tags="HR | recruiting | AI | handbook",
         compat="openai | anthropic", intent="TOFU", free=True),

    dict(num=212, pid="AA-DOC-PMG-AGENTPM-212", slug="doc-agent-assisted-pm-guide", name="Agent-Assisted PM Guide",
         cat="doc", sub="guide", desc="Guide for product managers on leveraging AI agents for research, specs, and tracking",
         price=0, compare=19, tags="product management | AI | agents | guide",
         compat="openai | anthropic | cursor | langchain", intent="TOFU", free=True),

    dict(num=213, pid="AA-DOC-SEC-AISECURITY-213", slug="doc-ai-security-best-practices", name="AI Security Best Practices",
         cat="doc", sub="guide", desc="Security best practices for deploying LLM-based agents in production",
         price=0, compare=19, tags="security | AI | best practices | deployment | guide",
         compat="openai | anthropic | langchain", intent="TOFU", free=True),

    dict(num=214, pid="AA-DOC-DAT-DATAOPS-214", slug="doc-dataops-quickstart", name="DataOps Quick Start Guide",
         cat="doc", sub="guide", desc="Quick start guide for implementing DataOps practices with AI-assisted pipelines",
         price=0, compare=19, tags="data | DataOps | pipelines | guide",
         compat="openai | anthropic | langchain", intent="TOFU", free=True),

    # ── PAID PRODUCTS (20) ─────────────────────────────────────────────────

    # Paid Prompts (4)
    dict(num=215, pid="AA-PRM-EDU-CURRICULUM-PRO-215", slug="prompt-curriculum-design-suite", name="Curriculum Design Prompt Suite",
         cat="prompt", sub="prompt_suite", desc="Advanced prompts for full curriculum mapping, prerequisite chains, and learning paths",
         price=39, compare=59, tags="education | curriculum | learning paths | prompts",
         compat="openai | anthropic | cursor | langchain", intent="MOFU", free=False),

    dict(num=216, pid="AA-PRM-HR-PERFREV-PRO-216", slug="prompt-performance-review-suite", name="Performance Review Prompt Suite",
         cat="prompt", sub="prompt_suite", desc="Prompt suite for 360 reviews, self-assessments, and calibration narratives",
         price=39, compare=59, tags="HR | performance review | 360 | calibration | prompts",
         compat="openai | anthropic | cursor", intent="MOFU", free=False),

    dict(num=217, pid="AA-PRM-PMG-COMPETITIVE-PRO-217", slug="prompt-competitive-analysis-chain", name="Competitive Analysis Prompt Chain",
         cat="prompt", sub="prompt_chain", desc="Multi-step prompt chain for competitor research, feature matrices, and positioning",
         price=49, compare=79, tags="product management | competitive analysis | research | prompts",
         compat="openai | anthropic | cursor | langchain", intent="MOFU", free=False),

    dict(num=218, pid="AA-PRM-HEALTH-CLINPATH-PRO-218", slug="prompt-clinical-pathway-suite", name="Clinical Pathway Prompt Suite",
         cat="prompt", sub="prompt_suite", desc="Prompts for designing evidence-based clinical pathways and care protocols",
         price=49, compare=79, tags="healthcare | clinical pathways | care protocols | prompts",
         compat="openai | anthropic", intent="MOFU", free=False),

    # Paid Skills (5)
    dict(num=219, pid="AA-SKL-EDU-ADAPTLEARN-PRO-219", slug="skill-adaptive-learning-module", name="Adaptive Learning Skill",
         cat="skill", sub="skill_module", desc="Skill that adjusts content difficulty and pacing based on learner performance",
         price=99, compare=149, tags="education | adaptive learning | personalisation | skill",
         compat="openai | anthropic | langchain", intent="BOFU", free=False),

    dict(num=220, pid="AA-SKL-HR-TALENTMATCH-PRO-220", slug="skill-talent-matching-module", name="Talent Matching Skill",
         cat="skill", sub="skill_module", desc="Skill for scoring candidate-role fit using weighted attribute matching",
         price=129, compare=189, tags="HR | talent matching | candidate scoring | skill",
         compat="openai | anthropic | langchain", intent="BOFU", free=False),

    dict(num=221, pid="AA-SKL-PMG-FEATUREGATE-PRO-221", slug="skill-feature-gating-module", name="Feature Gating Skill",
         cat="skill", sub="skill_module", desc="Skill for evaluating feature flags, rollout criteria, and experiment analysis",
         price=119, compare=179, tags="product management | feature flags | experiments | skill",
         compat="openai | anthropic | cursor | langchain", intent="BOFU", free=False),

    dict(num=222, pid="AA-SKL-SEC-INCIDENTRESP-PRO-222", slug="skill-incident-response-module", name="Incident Response Skill",
         cat="skill", sub="skill_module", desc="Skill for coordinating incident response workflows with containment and recovery steps",
         price=149, compare=219, tags="security | incident response | SOAR | containment | skill",
         compat="openai | anthropic | langchain", intent="BOFU", free=False),

    dict(num=223, pid="AA-SKL-DAT-ANOMALYDET-PRO-223", slug="skill-anomaly-detection-module", name="Anomaly Detection Skill",
         cat="skill", sub="skill_module", desc="Skill for detecting statistical anomalies and drift in time-series data streams",
         price=139, compare=199, tags="data | anomaly detection | time series | monitoring | skill",
         compat="openai | anthropic | langchain", intent="BOFU", free=False),

    # Paid Agents (6)
    dict(num=224, pid="AA-AGT-EDU-TUTORBOT-PRO-224", slug="agent-ai-tutor", name="AI Tutor Agent",
         cat="agent", sub="agent_config", desc="Agent for personalised tutoring sessions with Socratic questioning and progress tracking",
         price=399, compare=599, tags="education | tutor | personalised learning | agent",
         compat="openai | anthropic | langchain | langgraph", intent="BOFU", free=False),

    dict(num=225, pid="AA-AGT-HR-RECRUITER-PRO-225", slug="agent-recruiter-automation", name="Recruiter Automation Agent",
         cat="agent", sub="agent_config", desc="Agent for sourcing candidates, screening resumes, and scheduling interview pipelines",
         price=499, compare=699, tags="HR | recruiting | automation | pipeline | agent",
         compat="openai | anthropic | langchain | langgraph", intent="BOFU", free=False),

    dict(num=226, pid="AA-AGT-PMG-PRODOPS-PRO-226", slug="agent-product-ops", name="Product Ops Agent",
         cat="agent", sub="agent_config", desc="Agent for spec generation, backlog grooming, and cross-team dependency tracking",
         price=449, compare=649, tags="product management | ops | specs | backlog | agent",
         compat="openai | anthropic | langchain", intent="BOFU", free=False),

    dict(num=227, pid="AA-AGT-SEC-SOCSENTRY-PRO-227", slug="agent-soc-sentry", name="SOC Sentry Agent",
         cat="agent", sub="agent_config", desc="Agent for monitoring security alerts, enriching IOCs, and drafting incident reports",
         price=599, compare=899, tags="security | SOC | monitoring | SIEM | agent",
         compat="openai | anthropic | langchain | langgraph", intent="BOFU", free=False),

    dict(num=228, pid="AA-AGT-DAT-DATAENG-PRO-228", slug="agent-data-engineering", name="Data Engineering Agent",
         cat="agent", sub="agent_config", desc="Agent for designing schemas, writing transformations, and validating data pipelines",
         price=549, compare=799, tags="data | engineering | pipelines | transformation | agent",
         compat="openai | anthropic | langchain | langgraph", intent="BOFU", free=False),

    dict(num=229, pid="AA-AGT-HEALTH-CLINASSIST-PRO-229", slug="agent-clinical-assistant", name="Clinical Assistant Agent",
         cat="agent", sub="agent_config", desc="Agent for clinical documentation review, terminology lookup, and referral drafting",
         price=599, compare=899, tags="healthcare | clinical | assistant | documentation | agent",
         compat="openai | anthropic | langchain", intent="BOFU", free=False),

    # Paid Utilities (3)
    dict(num=230, pid="AA-UTL-SEC-PENTESTKIT-PRO-230", slug="utility-pentest-template-kit", name="Penetration Testing Template Kit",
         cat="utility", sub="utility_module", desc="Reusable pentest report templates, scope definitions, and finding classifications",
         price=99, compare=149, tags="security | penetration testing | reports | templates | utility",
         compat="openai | anthropic | langchain", intent="MOFU", free=False),

    dict(num=231, pid="AA-UTL-DAT-DASHBUILD-PRO-231", slug="utility-dashboard-builder-templates", name="Dashboard Builder Templates",
         cat="utility", sub="utility_module", desc="Templates for building analytics dashboards with KPI definitions and chart specs",
         price=89, compare=129, tags="data | dashboards | analytics | KPI | utility",
         compat="openai | anthropic | cursor", intent="MOFU", free=False),

    dict(num=232, pid="AA-UTL-HEALTH-IOSCHEMA-PRO-232", slug="utility-healthcare-io-schema", name="Healthcare IO Schema Pack",
         cat="utility", sub="utility_module", desc="HL7 FHIR-aligned IO schemas for structuring clinical data exchanges",
         price=109, compare=159, tags="healthcare | FHIR | HL7 | schemas | utility",
         compat="openai | anthropic | langchain", intent="MOFU", free=False),

    # Paid Docs (2)
    dict(num=233, pid="AA-DOC-SEC-SOCPLAYBOOK-PRO-233", slug="doc-soc-operations-playbook", name="SOC Operations Playbook",
         cat="doc", sub="playbook", desc="Comprehensive playbook for SOC operations including triage, escalation, and reporting",
         price=69, compare=99, tags="security | SOC | operations | playbook",
         compat="openai | anthropic | langchain", intent="MOFU", free=False),

    dict(num=234, pid="AA-DOC-HEALTH-COMPGUIDE-PRO-234", slug="doc-healthcare-compliance-guide", name="Healthcare Compliance Guide",
         cat="doc", sub="guide", desc="Guide covering HIPAA, HITECH, and FDA compliance for AI-assisted healthcare tools",
         price=59, compare=89, tags="healthcare | compliance | HIPAA | regulation | guide",
         compat="openai | anthropic", intent="MOFU", free=False),
]


def build_csv_row(p):
    """Build a products.collection.csv row dict."""
    price = p["price"]
    compare = p["compare"]
    savings = compare - price if compare > price else 0
    discount_pct = round((savings / compare) * 100) if savings > 0 and compare > 0 else 0

    is_free = p["free"]
    bg, fg = PALETTES.get(p["cat"], ("2C3748", "F5F8FC"))
    name_enc = urllib.parse.quote(p["name"])

    return {
        "product_id": p["pid"],
        "slug": p["slug"],
        "name": p["name"],
        "category": p["cat"],
        "subcategory": p["sub"],
        "short_desc": p["desc"],
        "cover_image_url": f"https://placehold.co/1200x800/{bg}/{fg}.png?text={name_enc}",
        "price_usd": price,
        "compare_at_price": compare,
        "discount_percent": discount_pct,
        "savings_usd": savings,
        "price_label": f"Now ${price}" if price > 0 else "Free",
        "compare_at_label": f"Was ${compare}" if compare > 0 else "",
        "savings_label": f"Save ${savings} ({discount_pct}% off)" if savings > 0 and price > 0 else ("Free Download" if price == 0 else ""),
        "intent": p["intent"],
        "tags": p["tags"],
        "compatibility": p["compat"],
        "sample_available": "Y" if is_free else "N",
        "sample_link": f"https://agentartifacts.io/sample/{p['slug']}" if is_free else "",
        "execution_mode": "none",
        "market_type": "none",
        "risk_level": "low",
        "risk_badge": "General",
        "disclosure_required": "N",
        "disclosure_text_short": "",
        "disclosure_version": "",
        "disclosure_ack_text": "",
        "disclosure_ack_required": "",
        "lead_magnet": "Y" if is_free else "N",
        "email_capture_required": "N",
        "status": "draft",
        "product_page_url": f"https://app.agentartifacts.io/products/{p['slug']}",
        "checkout_url": fake_stripe_url(p["pid"]),
        "success_page_url": f"https://app.agentartifacts.io/success?product_id={p['pid']}",
        "download_page_url": f"https://app.agentartifacts.io/success?product_id={p['pid']}#downloads",
        "stripe_lookup_key": p["pid"],
        "checkout_api_endpoint": "https://api.agentartifacts.io/checkout/session",
        "download_api_endpoint": "https://api.agentartifacts.io/downloads/signed-url",
        "disclosure_api_endpoint": "https://api.agentartifacts.io/disclosures/acknowledge",
        "cta_label": "Free Download" if is_free else "Buy Now",
        "cta_secondary_label": "Preview Sample" if is_free else "View Details",
    }


def csv_escape(val):
    s = str(val) if val is not None else ""
    if "," in s or "\n" in s or '"' in s:
        return f'"{s.replace(chr(34), chr(34)+chr(34))}"'
    return s


def generate_free_download(p):
    """Generate a free download markdown file."""
    cat_label = p["cat"].capitalize()
    prompts = []
    if p["cat"] == "prompt":
        prompts = [
            ("Core Template", "You are an expert assistant. Given the context below, produce a high-quality output.\n\nContext: {{context}}\nGoal: {{goal}}\n\nProvide:\n1. A structured analysis\n2. Actionable recommendations\n3. Key considerations"),
            ("Deep Dive", f"Analyse the following {p['name'].lower().replace(' prompt pack','').replace(' prompts','')} scenario in depth.\n\nInput: {{{{input}}}}\nConstraints: {{{{constraints}}}}\n\nProvide:\n1. Detailed breakdown\n2. Alternative approaches\n3. Risk factors\n4. Recommended next steps"),
            ("Quick Action", f"Generate a concise, actionable {p['name'].lower().replace(' prompt pack','').replace(' prompts','')} output.\n\nTopic: {{{{topic}}}}\nAudience: {{{{audience}}}}\nFormat: {{{{format}}}}\n\nKeep it focused and practical."),
            ("Review & Iterate", "Review the following draft output and suggest improvements.\n\nDraft: {{draft}}\nCriteria: {{criteria}}\n\nProvide:\n1. Strengths (what works well)\n2. Weaknesses (what needs improvement)\n3. Specific revision suggestions\n4. Priority order for changes"),
            ("Comparison Framework", f"Compare the following options for {{{{topic}}}} and recommend the best approach.\n\nOption A: {{{{option_a}}}}\nOption B: {{{{option_b}}}}\nContext: {{{{context}}}}\n\nEvaluate on: effectiveness, feasibility, cost, and timeline."),
        ]
    elif p["cat"] == "skill":
        prompts = [
            ("Skill Definition", f"# {p['name']}\n\n## Purpose\n{p['desc']}\n\n## Input Schema\n```json\n{{\n  \"input\": \"{{{{input}}}}\",\n  \"parameters\": {{\n    \"mode\": \"standard\",\n    \"threshold\": 0.8\n  }}\n}}\n```"),
            ("Execution Logic", f"## Processing Steps\n1. Validate input against schema\n2. Apply {p['name'].lower()} logic\n3. Score and rank results\n4. Return structured output\n\n## Error Handling\n- Invalid input: return validation error with specifics\n- Timeout: retry with exponential backoff\n- Ambiguous result: flag for human review"),
            ("Output Schema", "## Output Schema\n```json\n{\n  \"result\": \"{{result}}\",\n  \"confidence\": 0.95,\n  \"metadata\": {\n    \"processing_time_ms\": 120,\n    \"model_version\": \"1.0\"\n  }\n}\n```"),
        ]
    elif p["cat"] == "utility":
        prompts = [
            ("Template Overview", f"# {p['name']}\n\n## Purpose\n{p['desc']}\n\n## Quick Start\n1. Copy the template below\n2. Replace {{{{placeholders}}}} with your values\n3. Customise sections as needed"),
            ("Base Template", f"## Template\n\n```yaml\nname: {{{{project_name}}}}\nversion: 1.0.0\ntype: {p['sub']}\n\nconfiguration:\n  mode: standard\n  output_format: json\n\nsteps:\n  - name: init\n    action: validate_input\n  - name: process\n    action: transform\n  - name: output\n    action: deliver_result\n```"),
            ("Customisation Guide", "## Customisation\n\n- **Mode**: Choose `standard`, `strict`, or `lenient`\n- **Output**: Supports `json`, `yaml`, `csv`, and `markdown`\n- **Steps**: Add, remove, or reorder processing steps\n- **Validation**: Configure input validation rules per field"),
        ]
    elif p["cat"] == "doc":
        prompts = [
            ("Guide Overview", f"# {p['name']}\n\n## About This Guide\n{p['desc']}\n\n## Who Is This For?\nPractitioners looking to leverage AI tools effectively in their domain."),
            ("Getting Started", "## Getting Started\n\n### Prerequisites\n- Access to an LLM (Claude, GPT-4, or equivalent)\n- Basic understanding of prompt engineering\n- Domain-specific context and requirements\n\n### Setup Steps\n1. Choose your preferred AI model\n2. Configure your environment\n3. Start with the templates in this guide\n4. Iterate based on results"),
            ("Best Practices", "## Best Practices\n\n1. **Start simple** - Begin with basic prompts and add complexity\n2. **Be specific** - Provide clear context and constraints\n3. **Iterate** - Refine prompts based on output quality\n4. **Document** - Keep a log of effective prompt patterns\n5. **Validate** - Always review AI outputs before acting on them"),
        ]

    sections = []
    for i, (title, content) in enumerate(prompts, 1):
        if p["cat"] == "prompt":
            sections.append(f"## Prompt {i} — {title}\n\n```\n{content}\n```")
        else:
            sections.append(content)

    return f"""# {p['name']}
*Free download — Agent Artifacts*

> {cat_label} · {p['desc']}

---

## About This Download

This is a complete, usable free download from Agent Artifacts.
It covers core use cases for **{p['name']}** and works with any major LLM.

**Compatible with:** {p['compat']}

---

## Quick Start

Copy any template below, replace `{{{{placeholder}}}}` tokens with your context,
and paste directly into your AI tool of choice.

---

{chr(10).join(f'{s}{chr(10)}{chr(10)}---{chr(10)}' for s in sections)}

## License

Free for personal and commercial use. Attribution appreciated but not required.
Visit [agentartifacts.io](https://agentartifacts.io) for premium assets.
"""


def generate_paid_download(p):
    """Generate a paid download markdown file."""
    cat_label = p["cat"].capitalize()
    base_content = []

    if p["cat"] == "prompt":
        base_content = [
            ("Core Analysis", f"Analyse the following {p['name'].lower()} scenario in depth.\n\nInput: {{{{input}}}}\nContext: {{{{context}}}}\nGoal: {{{{goal}}}}\n\nProvide:\n1. Comprehensive analysis\n2. Key insights and patterns\n3. Strategic recommendations\n4. Risk assessment\n5. Implementation roadmap"),
            ("Strategic Framework", f"Apply a structured framework to the following challenge.\n\nChallenge: {{{{challenge}}}}\nStakeholders: {{{{stakeholders}}}}\nConstraints: {{{{constraints}}}}\nTimeline: {{{{timeline}}}}\n\nDeliver:\n1. Framework selection rationale\n2. Step-by-step application\n3. Expected outcomes\n4. Contingency plans"),
            ("Output Synthesis", "Synthesise the following inputs into a cohesive deliverable.\n\nInputs: {{inputs}}\nFormat: {{format}}\nAudience: {{audience}}\n\nEnsure:\n1. Executive summary (3 sentences max)\n2. Detailed findings\n3. Visualisation suggestions\n4. Next steps with owners and deadlines"),
            ("Quality Review", "Conduct a quality review of the following output.\n\nOutput: {{output}}\nCriteria: {{criteria}}\nStandards: {{standards}}\n\nAssess:\n1. Accuracy and completeness\n2. Clarity and readability\n3. Actionability\n4. Compliance with standards\n5. Specific improvement suggestions"),
            ("Iterative Refinement", "Refine the following draft through multiple passes.\n\nDraft: {{draft}}\nFeedback: {{feedback}}\nPriorities: {{priorities}}\n\nPass 1: Structural improvements\nPass 2: Content depth and accuracy\nPass 3: Tone and audience alignment\nPass 4: Final polish and formatting"),
            ("Scenario Planning", f"Generate scenario plans for the following situation.\n\nSituation: {{{{situation}}}}\nVariables: {{{{variables}}}}\n\nFor each scenario:\n1. Scenario name and probability\n2. Key assumptions\n3. Impact analysis\n4. Recommended actions\n5. Early warning indicators"),
        ]
    elif p["cat"] == "skill":
        base_content = [
            ("Skill Configuration", f"# {p['name']}\n\n## Configuration\n```yaml\nskill_id: {p['pid']}\nversion: 1.0.0\nmode: production\n\ninput_validation:\n  strict: true\n  schema_version: \"2.0\"\n\nprocessing:\n  timeout_ms: 30000\n  retry_count: 3\n  fallback: human_review\n\noutput:\n  format: json\n  include_metadata: true\n  confidence_threshold: 0.85\n```"),
            ("Input Schema", "## Input Schema\n```json\n{\n  \"$schema\": \"https://json-schema.org/draft/2020-12/schema\",\n  \"type\": \"object\",\n  \"required\": [\"input\", \"context\"],\n  \"properties\": {\n    \"input\": { \"type\": \"string\", \"minLength\": 1 },\n    \"context\": { \"type\": \"object\" },\n    \"parameters\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"mode\": { \"enum\": [\"fast\", \"standard\", \"thorough\"] },\n        \"threshold\": { \"type\": \"number\", \"minimum\": 0, \"maximum\": 1 }\n      }\n    }\n  }\n}\n```"),
            ("Processing Logic", f"## Processing Pipeline\n\n### Step 1: Input Validation\nValidate against schema, normalise encoding, check size limits.\n\n### Step 2: Feature Extraction\nExtract relevant features for {p['name'].lower()} processing.\n\n### Step 3: Core Logic\nApply {p['sub']} algorithms with configured thresholds.\n\n### Step 4: Confidence Scoring\nAssign confidence scores to each output element.\n\n### Step 5: Output Assembly\nStructure results per output schema with metadata."),
            ("Error Handling", "## Error Handling\n\n| Error Type | Code | Action |\n|-----------|------|--------|\n| Invalid input | E001 | Return validation errors |\n| Timeout | E002 | Retry with backoff |\n| Low confidence | E003 | Flag for review |\n| Dependency fail | E004 | Use fallback provider |\n| Rate limit | E005 | Queue and retry |"),
            ("Testing", "## Test Cases\n\n### Happy Path\n```json\n{\"input\": \"sample input\", \"context\": {\"type\": \"test\"}}\n// Expected: 200 OK with valid output\n```\n\n### Edge Cases\n- Empty input: should return E001\n- Oversized input: should return E001 with size details\n- Ambiguous input: should return result with low confidence flag"),
        ]
    elif p["cat"] == "agent":
        base_content = [
            ("Agent Configuration", f"# {p['name']}\n\n## Configuration\n```yaml\nagent_id: {p['pid']}\nversion: 1.0.0\ntype: {p['sub']}\n\norchestration:\n  max_steps: 20\n  timeout_minutes: 10\n  parallel_tasks: 3\n\ntools:\n  - name: search\n    enabled: true\n  - name: write\n    enabled: true\n  - name: review\n    enabled: true\n\nguardrails:\n  require_human_approval: [\"publish\", \"delete\", \"send\"]\n  max_retries: 3\n  cost_limit_usd: 5.00\n```"),
            ("Workflow Definition", f"## Workflow\n\n### Phase 1: Intake\n- Receive task input\n- Validate parameters\n- Plan execution steps\n\n### Phase 2: Execution\n- Execute planned steps sequentially\n- Track progress and intermediate results\n- Handle errors with retry logic\n\n### Phase 3: Review\n- Self-review output quality\n- Check against guardrails\n- Request human approval if needed\n\n### Phase 4: Delivery\n- Format final output\n- Log execution metrics\n- Return structured result"),
            ("Tool Definitions", "## Tool Specifications\n\n### Search Tool\n```json\n{\"name\": \"search\", \"description\": \"Search knowledge base and external sources\", \"parameters\": {\"query\": \"string\", \"sources\": [\"internal\", \"external\"], \"limit\": 10}}\n```\n\n### Write Tool\n```json\n{\"name\": \"write\", \"description\": \"Generate structured content\", \"parameters\": {\"type\": \"string\", \"format\": \"string\", \"context\": \"object\"}}\n```"),
            ("Deployment Guide", "## Deployment\n\n### Prerequisites\n- Node.js 18+ or Python 3.10+\n- LLM API access (Claude or GPT-4)\n- Environment variables configured\n\n### Setup\n1. Install dependencies\n2. Configure `agent_config.yaml`\n3. Set API keys in environment\n4. Run health check\n5. Deploy to production\n\n### Monitoring\n- Track task completion rate\n- Monitor average latency\n- Alert on error rate > 5%\n- Review cost per task weekly"),
        ]
    elif p["cat"] == "utility":
        base_content = [
            ("Template Pack", f"# {p['name']}\n\n## Templates Included\n\n### Template 1: Standard Configuration\n```yaml\nname: {{{{project}}}}\nversion: 1.0.0\nconfiguration:\n  mode: production\n  validation: strict\n  output: json\n```\n\n### Template 2: Advanced Configuration\n```yaml\nname: {{{{project}}}}\nversion: 1.0.0\nconfiguration:\n  mode: production\n  validation: strict\n  output: json\n  plugins:\n    - name: validator\n    - name: transformer\n    - name: reporter\n```"),
            ("Schema Definitions", "## Schemas\n\n### Input Schema\n```json\n{\n  \"type\": \"object\",\n  \"required\": [\"name\", \"config\"],\n  \"properties\": {\n    \"name\": {\"type\": \"string\"},\n    \"config\": {\"type\": \"object\"},\n    \"metadata\": {\"type\": \"object\"}\n  }\n}\n```\n\n### Output Schema\n```json\n{\n  \"type\": \"object\",\n  \"properties\": {\n    \"result\": {\"type\": \"string\"},\n    \"status\": {\"enum\": [\"success\", \"warning\", \"error\"]},\n    \"details\": {\"type\": \"array\"}\n  }\n}\n```"),
            ("Usage Guide", "## Usage\n\n1. Select the appropriate template\n2. Replace all `{{placeholder}}` values\n3. Validate against the provided schema\n4. Integrate into your workflow\n\n## Customisation\n\nAll templates support:\n- Custom field additions\n- Conditional sections\n- Multi-format export (JSON, YAML, Markdown)"),
        ]
    elif p["cat"] == "doc":
        base_content = [
            ("Executive Summary", f"# {p['name']}\n\n## Executive Summary\n\n{p['desc']}\n\nThis guide provides actionable frameworks, templates, and best practices for implementation."),
            ("Framework", "## Core Framework\n\n### Principles\n1. **Clarity** - Every process should be documented and understandable\n2. **Consistency** - Apply standards uniformly across the organisation\n3. **Continuous Improvement** - Regular review and iteration cycles\n4. **Compliance** - Meet regulatory and internal policy requirements\n\n### Implementation Phases\n\n| Phase | Duration | Focus |\n|-------|----------|-------|\n| Discovery | 2 weeks | Assess current state |\n| Design | 2 weeks | Define target architecture |\n| Build | 4 weeks | Implement core workflows |\n| Validate | 2 weeks | Test and refine |\n| Launch | 1 week | Go-live with monitoring |"),
            ("Templates & Checklists", "## Templates\n\n### Process Template\n- [ ] Define scope and objectives\n- [ ] Identify stakeholders\n- [ ] Document current workflow\n- [ ] Design improved workflow\n- [ ] Implement changes\n- [ ] Validate outcomes\n- [ ] Document lessons learned\n\n### Review Checklist\n- [ ] All requirements addressed\n- [ ] Compliance verified\n- [ ] Stakeholder sign-off obtained\n- [ ] Monitoring configured\n- [ ] Rollback plan documented"),
        ]

    sections = []
    for i, (title, content) in enumerate(base_content, 1):
        sections.append(f"### Section {i} — {title}\n\n{content}")

    return f"""# {p['name']}
**Product ID:** `{p['pid']}`
**License:** Commercial use permitted · Single-seat license
**Format:** Markdown + JSON

---

## Overview

{p['desc']}

This pack covers: `{p['sub']}` workflows.
All prompts use `{{{{variable}}}}` placeholder syntax — replace before using.

**Compatible with:** Claude 3.5+, GPT-4o, Gemini 1.5+, any instruction-following LLM

---

## {cat_label} Library

{chr(10).join(f'{s}{chr(10)}{chr(10)}---{chr(10)}' for s in sections)}

## License & Support

- **License:** Commercial · single-seat
- **Support:** [agentartifacts.io/support](https://agentartifacts.io/support)
- **Updates:** Included for 12 months from purchase
"""


def main():
    # Read existing CSV headers
    with open(PRODUCTS_CSV, "r") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames

    # Build new rows
    new_rows = [build_csv_row(p) for p in PRODUCTS]

    # Append to CSV
    with open(PRODUCTS_CSV, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        for row in new_rows:
            writer.writerow(row)

    print(f"Appended {len(new_rows)} products to {PRODUCTS_CSV}")

    # Generate download files
    free_count = 0
    paid_count = 0
    for p in PRODUCTS:
        # Paid download (all products get one)
        paid_path = os.path.join(PAID_DL_DIR, f"{p['pid']}.md")
        with open(paid_path, "w") as f:
            f.write(generate_paid_download(p))
        paid_count += 1

        # Free download (only lead magnets)
        if p["free"]:
            free_path = os.path.join(FREE_DL_DIR, f"{p['slug']}.md")
            with open(free_path, "w") as f:
                f.write(generate_free_download(p))
            free_count += 1

    print(f"Created {free_count} free downloads in {FREE_DL_DIR}")
    print(f"Created {paid_count} paid downloads in {PAID_DL_DIR}")
    print(f"Total new products: {len(PRODUCTS)} (free: {free_count}, paid: {len(PRODUCTS) - free_count})")


if __name__ == "__main__":
    main()
