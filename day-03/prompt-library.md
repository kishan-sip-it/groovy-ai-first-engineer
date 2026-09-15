# Prompt Library — 10 Reusable Engineering Templates

## 1. Inspect Before Implementing

```text
Context: [repository / feature]
Task: Inspect the current implementation and explain the relevant architecture before changing anything.
Constraints: Preserve existing conventions; do not modify files yet.
Acceptance: Identify relevant files, data flow, dependencies, risks, and one uncertainty.
Output: concise inspection report + proposed implementation plan.
```

## 2. Implement a Focused Feature

```text
Context: [feature + relevant files]
Task: Implement [specific feature].
Constraints: Reuse existing patterns; avoid unnecessary dependencies; keep scope limited.
Acceptance: [observable behavior]
Verification: Run [tests/build/lint/run command] and report only verified results.
```

## 3. Debug From Verified Evidence

```text
Context: [feature]
Observed error: [exact error/log]
Relevant files: [files]
Task: Find the root cause and make the smallest correct fix.
Constraints: Do not rewrite unrelated code.
Verification: Reproduce the failure, apply the fix, and rerun the same check.
```

## 4. Refactor Safely

```text
Context: [current code]
Goal: Refactor [target] for [reason].
Constraints: Preserve external behavior and public interfaces.
Acceptance: No behavior regressions; improved readability/maintainability.
Verification: Run tests/build and summarize changed files + verified results.
```

## 5. API Endpoint Template

```text
Context: [backend architecture]
Task: Add [METHOD] [ROUTE].
Input: [schema]
Output: [schema]
Errors: [400/401/404/409/500 behavior]
Constraints: Follow existing validation, auth, and response conventions.
Verification: Add/update tests and exercise success + failure paths.
```

## 6. React UI Feature Template

```text
Context: [component/page]
Task: Add [UI feature].
UX requirements: loading, empty, error, success states; keyboard accessibility.
Constraints: Reuse existing styles/components.
Acceptance: User can complete [workflow] without console errors.
Verification: Build and manually test the happy path + one failure path.
```

## 7. AI Integration Template

```text
Context: [application + model/provider]
Task: Integrate an LLM call for [purpose].
Input: [structured input]
Output: [required schema]
Constraints: Keep secrets in environment variables; validate model output before use; handle provider errors.
Verification: Run mocked/local tests and, when credentials are available, one live request.
```

## 8. Code Review Template

```text
Review the changed files as a senior engineer.
Focus on: correctness, security, performance, maintainability, accessibility, and edge cases.
For every finding provide: severity, file/line, why it matters, and a minimal fix.
Do not invent issues. Report only findings supported by the code.
```

## 9. Repository / Codebase Explainer

```text
Inspect this repository and explain:
1. architecture
2. entry points
3. data flow
4. external integrations
5. testing strategy
6. configuration/secrets
7. highest-risk areas
Do not modify files.
Keep the explanation under [N] tokens and cite file paths.
```

## 10. Final Verification Gate

```text
Act as the release reviewer for the implementation above.
Check: imports, runtime paths, API contracts, error handling, security basics, tests, build, and README instructions.
Make only necessary fixes.
Run the available verification commands.
Return a release checklist with PASS/FAIL and exact evidence.
```
