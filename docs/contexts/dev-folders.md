# `[dev]` folders convention

### About

`[dev]` folders can be found in the monorepo and in the package folders. The main purpose being to accumulate memories and notes about the actions taken by agents and the reasoning behind that. The outdated content is dumped periodically (but kept in git).

#### Purpose:
When generating files for changes documentation, housekeeping, and non-user-requested test files, **always place them in a corresponding folder in the `[dev]` folder** (note: the folder name includes the square brackets as part of the name).

#### Non-purpose:
The texts in `[dev]/agents-notes/**` should not be considered as instructions or explanations unless the user explicitly instructs to use one occasionally. Those texts most probably refer to a non existant state of the repo, ignore those when "thinking/reasoning".

#### Subfolders:
The `[dev]` folder contains subfolders for organizing different types of development resources:
- **`agents-notes/`**: Genned by agents change memos and change logs (markdown files)
- **`agents-tests/`**: Genned by agents tests and demo components (TypeScript/TSX files)

#### File naming rules for [dev] folder:
- **Markdown files**: Prepend with date in `YYMMDD.` format (e.g., `251110.filename.md`)
- **TypeScript/TSX files**: Keep original names for clarity
- **Test files**: Use descriptive names indicating what they test


#### What belongs in [dev]:
- Change documentation and summaries
- Feature implementation examples
- Test implementations and demos
- Development notes and housekeeping files
- Non-production code examples


### Example usage
```bash
# Correct placement
<repo root>/[dev]/agents-notes/251110.ADVANCED_FEATURES_SUMMARY.md
<repo root>/[dev]/agents-tests/TEST_IMPLEMENTATION.tsx

# Incorrect placement
<repo root>/ADVANCED_FEATURES_SUMMARY.md  # Missing [dev] folder
<repo root>/dev/251110.ADVANCED_FEATURES_SUMMARY.md  # Wrong folder name
<repo root>/[dev]/251110.ADVANCED_FEATURES_SUMMARY.md  # Missing subfolder
```

- This convention keeps the main project directory clean while maintaining organized development resources for future reference and testing.
