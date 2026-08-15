# Free-plan implementation findings

## Official sources consulted

1. Firebase Pricing: https://firebase.google.com/pricing
2. Firestore quotas: https://firebase.google.com/docs/firestore/quotas
3. Firebase pricing plans: https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
4. GitHub Actions billing: https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions

## Key findings

- Firebase Spark is a no-cost plan and does not require a payment method for the no-cost products and quotas.
- Firestore Spark quota includes 1 GiB stored data, 50,000 document reads/day, 20,000 document writes/day, 20,000 document deletes/day, and 10 GiB/month outbound transfer.
- Firestore managed backup data, restore operations, PITR, TTL deletes, and clone operations require billing; therefore a true scheduled managed backup cannot be promised on Spark.
- Cloud Functions are not available on Spark, even though Blaze lists a no-cost invocation allowance; therefore server-side email triggers cannot be deployed without changing the plan.
- Firebase Hosting has a no-cost quota and supports a custom domain/SSL feature, but a purchased domain itself is not free.
- GitHub Free includes a monthly GitHub Actions allowance for private repositories; public repositories use standard GitHub-hosted runners at no cost. The project should avoid unnecessary artifact retention and avoid workflows that can exceed the included quota.

## Free alternatives to implement

- Local JSON export from the admin dashboard for manual backups, with no cloud storage charge.
- Browser Notification API and visible dashboard alerts while the admin dashboard is open, instead of a paid/server-side email trigger.
- Existing deterministic duplicate prevention, Firestore rules, audit log, search/filtering, CSV export, privacy/terms pages, robots.txt, sitemap.xml, and GitHub Actions quality gates.
- Manual WhatsApp follow-up for CV transfer, already part of the product flow.

## Features that must be explicitly marked as unavailable on Spark

- Automatic server-side email notification after a new application.
- Managed scheduled Firestore backup/restore.
- Purchased custom domain.
- Server-side CAPTCHA verification unless an external free service is intentionally configured and its limits are accepted.
