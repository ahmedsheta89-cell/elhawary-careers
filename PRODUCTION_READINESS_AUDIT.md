# Production Readiness Audit — El Hawary Careers

## Baseline

The project is a React 18 + TypeScript + Vite application using Firebase Authentication and Firestore, deployed to Firebase Hosting. GitHub Actions already performs dependency installation, linting, type checking, production build, hosting deployment, and Firestore rules deployment for pushes to `launch-readiness`.

## Confirmed strengths

- Public job browsing, job details, application submission, success/WhatsApp flow, contact page, about page, benefits page, and admin dashboard are implemented.
- Centralized site content and theme editing are available to the administrator.
- Firebase rules restrict job mutations, content/settings writes, staff-role writes, and application review mutations.
- Public application creation is restricted to active jobs and requires privacy consent.
- The application service validates core fields with Zod before writing to Firestore.
- The production CI workflow completed successfully with lint, typecheck, build, Hosting deployment, and Firestore rules deployment.

## Findings requiring implementation

| Area | Current state | Required improvement |
|---|---|---|
| Legal pages | Footer labels point to placeholder `#` links; no privacy or terms routes exist | Add editable Privacy Policy and Terms pages and real footer routes |
| Consent UX | Consent text is hard-coded in the application page and is not linked to a legal page | Link consent to the privacy policy and terms pages; keep consent mandatory |
| Abuse prevention | No duplicate submission check, rate limiting, CAPTCHA/Turnstile, or client-side submission lock beyond the loading state | Add safe duplicate protection and an optional server-verifiable anti-bot integration without exposing secrets |
| Firestore application writes | Public create is constrained by field whitelist, active job, status, and consent, but does not prevent repeated submissions | Add a deterministic duplicate marker or controlled duplicate policy; avoid trusting client-only checks |
| Admin review | Applications load as one ordered list with status updates only | Add search, status/job/date filters, CSV export, pagination or bounded loading, and reviewer notes/history where compatible with current rules |
| SEO | `index.html` has a placeholder title and no description/Open Graph/robots/sitemap metadata | Add production metadata, dynamic page titles, robots.txt, sitemap.xml, and job-sharing metadata |
| Accessibility/mobile | Core responsive UI exists but requires a full interaction pass | Verify keyboard focus, labels, error announcements, touch targets, and mobile application flow |
| Notifications | No production email notification path exists; Firebase Spark constraints and missing provider credentials must be respected | Implement a provider-agnostic notification boundary and enable delivery only after a provider/plan is selected |
| Backup/monitoring | No documented backup job, audit trail, or operational monitoring is present in the application | Add an operational runbook, safe export path, audit records, and monitoring hooks; avoid claiming automated backups until credentials and billing constraints are confirmed |
| GitHub release flow | Automatic deployment triggers on `launch-readiness` | Add branch protection/release guidance and optionally move production deployment to `main` after a controlled merge |

## Constraints

The current project intentionally avoids Firebase Storage and CV uploads. The WhatsApp CV flow should remain the default. Email delivery, scheduled Firestore exports, CAPTCHA verification, and custom-domain configuration may require external credentials, provider setup, or a Firebase billing plan; these should be implemented behind explicit configuration rather than silently enabled.

## Implementation order

1. Legal routes, consent links, and editable legal copy.
2. Application hardening: normalization, duplicate policy, safer errors, and optional anti-bot configuration.
3. Admin search/filter/export and bounded loading.
4. SEO/accessibility/mobile pass.
5. Notification boundary plus provider setup instructions.
6. Backup/audit/monitoring runbook and any feasible code support.
7. GitHub release-flow hardening.
8. Full quality checks, production deployment, and live verification.
