# Conventional Commits

This project follows [Conventional Commits](https://conventionalcommits.org/) specification.

## Format

Each commit message should follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

## Examples

```
feat: add user authentication
fix: resolve memory leak in websocket handler
docs: update installation instructions
refactor: simplify error handling logic
test: add unit tests for problem manager
chore: update dependencies
```

## Enforcement

Commit messages are validated using commitlint with husky git hooks. Invalid commit messages will be rejected.

To test a commit message:
```bash
echo "feat: your commit message" | npx commitlint
```