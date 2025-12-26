# Monorepo Agent Instructions

This document contains monorepo-wide guidelines for all packages in the project project.

This document contains strictly prescriptive rules for generative coding agents. Use tools like read_file, list_files, and search_files to derive project context dynamically. Focus on applying these rules in code generation and modifications.

## Forbidden behaviour
- Never change the tooling or configuration installed or set outside of the monorepo
  - Such chnages should be suggested to the user to perform and may be regected then suggest other solutons
  

## Monorepo Basics

### Context

- Instead of self-contained agents.md-s and similar we use specilaized context files for agents, which contain conventions, instructions and guidelines belonging to the agents file as if the content of those external files was inherent part of the content of the given angents file.
- Unconditionally parse (read) the specialized context files identified by the `follow!` instruction.
  - The instruction format is `follow! [relative/path/to/file.md](absolute/path/to/file.md)` or just `follow! [relative/path/to/file.md]`.
  - Treat the content of these referenced files as if they were directly embedded in this document.
- In monorepo root and in roots of package and shared folders we place standard AGENTS.md files which are the entry points for collecting those relevant context instructions.
- Other context files should never be descovered or searched for automatically, instead follow the rule that all relevant context files are explicitly referenced in the standard AGENTS.md files hierarchy of the given package or shared folder.
- Package-specific rules override monorepo rules when conflicting.
- Shared guidelines should be referenced, not duplicated.
  - See the relevant section below

### Package managers 
- **TS**: 
  - pnpm v10+ with workspace support (never bun, yarn or npm)
  - use pnpm for all package management operations
- **Rust**: cargo
- **Py**: uv
- **Orchestration**: Turbo for monorepo task management
- **Local runner**: 
  - Sripts (the manually run ts script files and the commands in 'package.json/scripts') are to be run by bun v1.3+ (not npm)
  - The manually run npm packages are to be run by bunx (not npx)
  - All local/housekeeping/config scripts must run by bun and (unless explicitly instructed otherwise) rely on the Bun 1.3+ API wherever possible (replace the Node's api where possible)


## Monorepo Structure and Rules

### Package Organization

- **Main code folder**: `<reporoot>/code/` contains all source packages
  - don't try to find 'src' folders its 'app' or 'code'
- **Special folders**: We use square brackets for certain special folders (`[dev]`, `[prepared]`, `[secrets]`)

### Secrets Management
- Use AGE and SOPS for secrets management across packages
- Secrets should never be committed to version control
- Reference secrets through proper environment configuration

### Resource Management
- Resource files like fonts in `<reporoot>/vendor` should not be referenced directly from app codes
- Handle vendor resources through build tool configuration (rsbuild)
- Each package should manage its own resource dependencies

### File Movement Restrictions
- **Files should not be moved around** between packages and shared folders without explicit user's approval
- If file movement ideas arise during development, ask the user first
  - And be prepared that such file operations may not be approved
  - If so always consider alternative solution paths

### Development Resources
- Unless instructed otherwise all generated development documentation (like changes or housekeeping) related to a package (or a shared folder) belongs to the `<packageroot>/[dev]` folder
  - see further instructions regarding the `[dev]` forlder in the respective section below
- Use dated markdown files (YYMMDD.format) for change documentation
- Organize by type: `agents-notes/`, `agents-tests/`, `specs/`

## Cross-Package Conventions

### Typescript world
- TypeScript conventions:
  - follow! [`/docs/contexts/typescript-standards.md`](/docs/contexts/typescript-standards.md)
- React conventions where applicable:  
  - follow! [`/docs/contexts/react-patterns.md`](/docs/contexts/react-patterns.md)
- Lit conventions where applicable:
  - follow! [`/docs/contexts/lit-patterns.md`](/docs/contexts/lit-patterns.md)
- Styling conventions unless otherwise specified explicitly should be consistent where applicable:
  - follow! [`/docs/contexts/styling-conventions.md`](/docs/contexts/styling-conventions.md)
- Design system:
  - follow! [`/docs/contexts/design-system.md`](/docs/contexts/design-system.md)


### Development Resources Management

- Specs are located in `docs/specs` folders across the repo and in each package folder
  - Default standard is [Spec Kit](https://github.com/github/spec-kit)
  - Genned specs must be marked by the name of the model used by the agent (and its name, like: Opencode/kimi-for-coding)
- Use `[dev]` folders with dated markdown files, organized in subfolders for notes and tests.
  - follow! [`/docs/contexts/dev-folders.md`](/docs/contexts/dev-folders.md)


## Directory Structure and Purposes

```
m/  # dagger modules

content/    # Content for generating components' content (mostly not from 3rd parties)
├── identika/           # Logos and other visuals and textlets of the site
├── snippets/           # Markdown and other non-visual or hybrid content
└── public/
    └── favicon.png        # Site icon

vendor/     # local copies of 3rd parties' stuff 
├── fonts/           # Logos and other visuals and textlets of the site
└── xox/           #

config/
└── ...

[dev]/
├── specs/          # specifications for SDD, see https://github.com/github/spec-kit
├── agents-notes/          # For agent's notes
└── agents-test/           # For tests generated by agent's but not explicitly ordered by the user

```
