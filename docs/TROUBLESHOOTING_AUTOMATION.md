# Automation Troubleshooting

## Playwright MCP `Transport closed`
- Symptom: all `playwright/browser_*` actions fail immediately with `Transport closed`.
- Recovery steps:
1. Restart Codex automation session.
2. Ensure Framer login is active in that new session.
3. Re-run with a single `browser_navigate` test to confirm control before bulk edits.

## Workspace Files Marked `dataless`
- Symptom: file reads hang (`head`, `cat`, `wc`) on repo files.
- Cause: iCloud Optimized Storage placeholders.
- Fix:
1. Open Finder on project folder and force local download for the folder.
2. Confirm files no longer show `dataless` flag:
   - `ls -lO <file>`
3. Re-run scripts after files are local.

## Safe Publish Procedure
1. Publish staging first.
2. Run route/click QA pass.
3. Promote to production only after full checklist pass.

