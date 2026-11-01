# Security Policy

The **Student Success Predictor (SSP)** team takes the security of our application, machine learning models, and institutional student data very seriously. This document outlines our security policies, supported versions, guidelines for reporting security vulnerabilities, and system protection practices.

---

## 1. Supported Versions

Security updates, vulnerability patches, and bug fixes are actively provided for the following releases:

| Version | Supported | Maintenance Status |
| :--- | :---: | :--- |
| `1.x.x` (Current) | :white_check_mark: | Active support & continuous security updates |
| `< 1.0.0` | :x: | Deprecated / No updates provided |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability or sensitive information exposure in this project, **please do not open a public issue or discussion**. Publicly disclosing a flaw before it is addressed puts user and institutional data at risk.

### Responsible Disclosure Process:
1. **Contact Us Directly**: Send a confidential report to the security team via email at:  
   **`security@studentsuccesspredictor.edu`** or directly via [GitHub Security Advisories](https://github.com/chakradhar0910-jpg/ML-Based-Student-Success-Predictor/security/advisories/new).
2. **Provide Descriptive Details**: Include the following information in your report:
   - A clear description of the vulnerability and its potential impact.
   - Exact steps or minimal proof-of-concept (PoC) to reproduce the issue.
   - Affected endpoints, scripts, or components.
   - Recommended remediation or mitigation steps (if available).
3. **Acknowledgment & SLA**:
   - **Initial Response**: Within **48 hours** of receiving your report.
   - **Triage & Assessment**: Within **5 business days**, detailing validity and priority severity.
   - **Patch & Release**: Critical vulnerabilities will be prioritized for expedited release within **14 business days**.

We kindly request that you maintain confidentiality until an official patch has been deployed and disclosed.

---

## 3. Threat Model & Security Controls

The Student Success Predictor platform handles sensitive academic information and employs multi-layered defenses:

### A. Authentication & Session Management
- **Password Hashing**: Passwords must never be stored in plain text. Passwords are salted and hashed using `bcrypt` (12 work factor rounds).
- **JWT Cryptographic Integrity**: Authenticated sessions are governed by JSON Web Tokens (JWT) signed with HMAC-SHA256 (`HS256`) and enforced with explicit token expiration (`exp`) timestamps.
- **Header Protection**: Web API endpoints validate the `Authorization: Bearer <token>` header on protected operations.

### B. Secrets & Credential Protection
- **No Hardcoded Secrets**: Sensitive database passwords, JWT secrets, and API credentials must never be committed to source control.
- **Environment Isolation**: All configuration is managed via `.env` files (ignored in `.gitignore`) and modeled after `.env.example` templates.
- **Production Secret Rotation**: `JWT_SECRET_KEY` and database credentials should be generated with cryptographically secure random sequences (e.g., `openssl rand -hex 32`) and rotated periodically.

### C. Injection & Data Integrity Defenses
- **SQL Injection Prevention**: All queries against MySQL/MariaDB use strict parameterized placeholders (`%s`) via `PyMySQL` prepared statements. Dynamic string concatenation inside SQL queries is strictly prohibited.
- **Data Validation & Sanitization**: Incoming request payloads are validated and type-cast before consumption by the backend services. Numerical parameters (e.g., CGPA `0.0 - 10.0`, attendance `0 - 100%`) are bounds-checked.
- **Excel & CSV File Hardening**: Uploaded batch files are inspected for file extension, encoding (`utf-8-sig` handling for Windows BOM), and verified against malicious format injection.

### D. Network & Deployment Security
- **CORS Policies**: Cross-Origin Resource Sharing is enabled explicitly for legitimate client origins in production environments.
- **Production WSGI Application Server**: The built-in Flask server (`app.run()`) is strictly restricted to local development. Production deployments must use battle-tested WSGI servers such as **Gunicorn** (Linux/Docker) or **Waitress** (Windows) behind a reverse proxy (e.g., Nginx, Cloudflare) with HTTPS/TLS 1.3 encryption.
- **Least-Privilege Database Access**: The database user should only have permissions on `student_success_db` without administrative superuser privileges.

### E. Machine Learning Model Safeguards
- **Model Deserialization Integrity**: Artifacts (`model.pkl`, `preprocessor.pkl`) must be verified against unauthorized modification. Pickle deserialization is only performed on trusted, repository-controlled artifact files.

---

## 4. Security Checklist for Deployments

Before taking this application live in an institution or production cluster, ensure:

- [ ] `FLASK_ENV` is set to `production` (disabling debug traceback exposure).
- [ ] `JWT_SECRET_KEY` is replaced with a high-entropy secret (minimum 32 characters).
- [ ] Database credentials are non-default and restricted to local/internal network interfaces.
- [ ] HTTPS (SSL/TLS) is enforced for both frontend client and backend API domains.
- [ ] Automated CI/CD dependency scanning and security checks pass without warnings.
