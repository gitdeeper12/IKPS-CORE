# Contributing to IKPS v1.0.0

Thank you for your interest in contributing to **IKPS**!

## How to Contribute

### 1. Report Bugs
- Use GitHub/GitLab Issues
- Include: browser version, OS, steps to reproduce
- Label: `bug`

### 2. Suggest Features
- Open an issue with label `enhancement`
- Describe the use case and expected behavior
- New projection curves or metrics are welcome

### 3. Submit Code Changes

#### Prerequisites
```bash
npm install
npm run build
```

Development Workflow

```bash
git clone https://github.com/gitdeeper12/IKPS
cd IKPS
git checkout -b feature/your-feature-name
npm test
git commit -m "feat: add new projection curve"
git push origin feature/your-feature-name
```

4. Update Documentation

· Edit README.md, docs/, or docstrings
· Ensure documentation builds correctly

Code Style

· TypeScript: ESLint + Prettier
· React: Functional components with hooks
· CSS: Tailwind CSS

Testing Requirements

· All tests must pass: npm test
· New features require tests
· Layer separation must be preserved
· No archival condition must be enforced

Commit Convention

Type Description
feat New feature
fix Bug fix
docs Documentation
test Testing
refactor Code refactor
perf Performance improvement

Questions?

Open an issue or email: gitdeeper@gmail.com

---

Thank you for contributing to epistemic projection systems! 🧠
