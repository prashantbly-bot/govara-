# GoVara Modular Frontend

Main entry point: `index.html`

Modules:
- 26A System Configuration
- 26B User & Role Control
- 26C Business Policies
- 26D Operations Control
- 26E Financial Control
- 26F Documents & KYC
- 26G Audit & Monitoring
- STEP 27 Consolidated API

Core files handle state, storage, audit, i18n, routing and the main shell.
Backend and database are intentionally not connected in this stage.

Important 26B rules:
- Admin cannot be disabled.
- Customer is the fixed primary booking initiator.
- A disabled module forces all CRUD/approve permissions off.
- Frontend role settings do not replace backend authorization.
