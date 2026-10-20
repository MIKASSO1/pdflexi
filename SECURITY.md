# Security posture

This repository is a frontend prototype, not a security-audited service. No system is guaranteed unhackable.

## Included

- Escaped React content and no `dangerouslySetInnerHTML`.
- No remote AI requests, file upload endpoints, executable model output, credentials, ads or analytics.
- In-memory files/chat; bounded preview attachments; extension/size checks and a PDF-header sanity check.
- Revoked object URLs when attachments are removed.
- Production header baseline in `public/_headers`, where the hosting platform supports it.
- Locked dependency versions via package-lock.json, an optional build/unit-test CI template, and Dependabot configuration.

## Limitations / next phases

- File validation is not malware detection. Do not treat it as one.
- Native PDF viewing relies on browser security and compatibility.
- Static previews do not enforce quotas or authenticate users.
- Future engines must use isolated workers, bounds, schemas, cancellation and output validation.
- Future AI must ignore instructions embedded in documents, use allowlisted tools, and never claim tool success without verification.
- Do not introduce secrets in client code or commit credentials.
- An embedded PDF is loaded by the viewer on the user's device; selecting a Word/Excel file does not prove it is a valid Office document.
- Host configuration, dependency review, real-device/browser testing and an independent security review are still needed before a commercial release.

If reporting a vulnerability, do not post private documents, secrets or exploit payloads in public issues. Use the repository owner's private reporting channel when configured.
