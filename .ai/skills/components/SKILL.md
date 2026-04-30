# Skill: Components Reuse

Primary reusable components:

- `src/components/common/modal/BaseModal.tsx`
- `src/components/common/feedback/AppSnackbar.tsx`
- `src/components/common/loading/CircularLoader.tsx`
- `src/components/common/loading/SkeletonLoader.tsx`

Guidelines:

- Reuse first.
- If extension is needed, evolve generic component instead of duplicating.
- Keep accessibility labels and keyboard support.
