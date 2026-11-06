---
name: ralph-loop
description: Resume or perform bounded iterative development with persistent progress and evidence of acceptance criteria.
---
# Bounded iterative development

Use for explicitly requested iterative work. Read the task, latest execution report and actual repo state. Plan the smallest useful iteration, implement within scope, test, review and record evidence and remaining work in an execution record. Repeat while progress is possible up to configured `max_iterations`; the limit is not a reason to claim success. After a context reset, verify recorded claims against current files and Git state. If the same failure repeats without meaningful progress, or an external change or new authority is needed, stop with the blocker and next step. Never fabricate test results or expand permissions. See `execution/README.md` and `agents/workflows/resume.md` in the hub.
