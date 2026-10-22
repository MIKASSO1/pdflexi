# Security posture

This repository is a frontend prototype, not a security-audited service. No system is guaranteed unhackable.

## Included

- Escaped React content and no `dangerouslySetInnerHTML`.
- No remote AI requests, file upload endpoints, executable model output, credentials, ads or analytics.
- In-memory files/chat/manual-edit drafts; bounded attachments; extension/size checks and a PDF-header sanity check.
- Revoked object URLs when attachments are removed.
- Production header baseline in `public/_headers`, where the hosting platform supports it.
- Locked dependency versions via package-lock.json, a build/unit/browser-test GitHub Actions workflow, and Dependabot configuration.

## Limitations / next phases

- File validation is not malware detection. Do not treat it as one.
- PDF.js processes untrusted PDFs locally. Keep renderer/export dependencies up to date and validate resource limits on real devices.
- Static previews do not enforce quotas or authenticate users.
- Eight local tool engines now use disposable Workers, strict schemas, resource bounds, cancellation and output-header validation. Workers are not an OS-level sandbox; memory exhaustion and parser vulnerabilities remain risks.
- Optional IndexedDB result storage is local and unencrypted. Shared-device users can access saved documents; browser eviction can erase them. Only static app resources are eligible for service-worker caching.
- The command planner is deterministic and conservative, not a connected LLM. Every supported plan needs confirmation; planned tools are blocked.
- Future AI must ignore instructions embedded in documents, use allowlisted tools, and never claim tool success without verification.
- Do not introduce secrets in client code or commit credentials.
- PDFs are rendered on the user’s device; selecting a Word/Excel file does not prove it is a valid Office document.
- Eraser and Delete remove only local annotations. They are not secure redaction or original-content removal.
- Edited exports flatten additions into transparent images, may invalidate signatures and require independent fidelity/security checks before sensitive use. Originals are not overwritten.
- Drafts are not persisted after reload. Download to retain changes; a browser leave warning cannot guarantee recovery.
- Host configuration, dependency review, real-device/browser testing and an independent security review are still needed before a commercial release.

If reporting a vulnerability, do not post private documents, secrets or exploit payloads in public issues. Use the repository owner's private reporting channel when configured.
