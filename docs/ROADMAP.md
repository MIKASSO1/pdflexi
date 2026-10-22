# Four-phase delivery plan

Current increment: the modular local execution foundation is implemented with 8 real worker executors, validated multi-step planning, explicit confirmation, optional IndexedDB saving and bounded static-resource Offline caching. See [architecture V2](ARCHITECTURE-V2.ar.md). The remaining 22 tools, LLM, accounts and commercial controls are not complete.

All 30 capabilities remain in product scope. These phases divide implementation work, not the intended product into three-tool releases.

1. **Foundation and frontend (this version):** complete workspace shell, capability registry, chat UX, original-file preview, responsive/RTL layout, localization foundation, informational dialogs and tests. Not an operational PDF/AI service.
2. **Document engines:** implement all 20 traditional capabilities, review licenses, benchmark browser feasibility, preserve originals and add real version history, cancellation and validated downloadable output. Conversion, text editing, encryption and OCR require dedicated feasibility work.
3. **Agent and intelligent services:** tested model integration, typed planning and clarifications, multi-operation execution, verification, and the 10 intelligent services. Evaluate each capability separately; authenticity and legal certification have strict limitations. Unsupported cases must be explicit, not silently routed to an undisclosed paid API.
4. **Hardening and launch:** accessibility, device/browser/language coverage, security review, load/resource tests, final localization, privacy/legal documents, suitable hosting, accounts and commercially validated billing/quota/ad flows where applicable.

Security and testing run across every phase. The final phase is a complete release review, not their starting point. The 29-language registry is not proof of translated content or model quality in 29 languages.

## Open decisions

- Final translations for the remaining 26 locales.
- Per-engine browser support, licensing, fidelity and limits.
- Model choice, model download size, hosting terms and bandwidth budget.
- How to handle unsupported devices without breaking the conversation-first product.
- Secure handling of private tool parameters.
- Any legal signature/certification provider.
- Monetization policies and location-dependent privacy/consent requirements.
- Real-world tests and economics before promising unlimited use or 60,000 daily visitors.
