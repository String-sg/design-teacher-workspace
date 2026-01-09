---
active: true
iteration: 2
max_iterations: 40
completion_promise: 'ALL_COMPLETE'
started_at: '2026-01-09T10:00:00Z'
---

## CRITICAL: You must ACTUALLY implement changes, not just claim completion.

Implement the code review tasks in todos/project-todos.json (tw-010 through tw-027).

### Your workflow for EACH task:

1. **Read** todos/project-todos.json - find next task with status "not_started" (prioritize high → medium → low)
2. **Update** the task status to "in_progress" in the JSON file
3. **Read** the source file(s) mentioned in the task description
4. **Edit** the file(s) to implement the fix - USE THE EDIT TOOL
5. **Run** `bun run check && bun run build` to verify
6. **Fix** any errors until checks pass
7. **Update** the task status to "completed" with completedAt timestamp
8. **Append** to progress.txt: `[timestamp] tw-XXX - brief description of what was changed`
9. **Commit** with: `git commit -am 'fix(review): tw-XXX - description'`
10. **Repeat** for next task

### VERIFICATION BEFORE COMPLETION:

Before outputting the completion promise, you MUST verify:

- Run: `jq '[.todos[] | select(.id >= "tw-010" and .status == "not_started")] | length' todos/project-todos.json`
- The result MUST be 0 (zero tasks remaining)
- If not 0, continue working on remaining tasks

### Output Rules:

- ONLY output `<promise>ALL_COMPLETE</promise>` when the jq command above returns 0
- Do NOT lie or claim false completion to escape the loop
- If stuck on a task after 3 attempts, skip it and document in progress.txt, then continue

### Important:

- Keep unused components (empty-state.tsx, use-mobile.ts) - planned for future use
- Do NOT create new files unless task specifically requires it (tw-023, tw-024)

START NOW: Read todos/project-todos.json and begin with the first not_started high-priority task.
