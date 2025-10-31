# Security Policy

## Reporting a Vulnerability
- Email: your internal security contact
- Please include: affected files/URLs, reproduction steps, and impact assessment
- Do not include sensitive data in reports

## Secrets and Sensitive Data
- This repo should not contain credentials or tokens
- Verified areas (at handoff):
  - Root and `assets/` for embedded keys
  - `code/winzer-main/` for `.env` or hardcoded secrets
  - `code/winzer-middleware/` for appsettings and configuration files
  - Git history spot-check for accidental commits

## Guidance
- Store secrets in your organization’s secret manager (AWS Secrets Manager, GitHub Actions secrets)
- Use environment variables and configuration files excluded via `.gitignore`
- Rotate any credentials used in deployment immediately after handoff
