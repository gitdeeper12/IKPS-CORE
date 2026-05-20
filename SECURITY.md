# Security Policy for IKPS v1.0.0

## Supported Versions

| Version | Supported | Notes |
|---------|-----------|-------|
| 1.0.x   | ✅ Yes    | Current stable |
| < 1.0   | ❌ No     | Pre-release only |

## Reporting a Vulnerability

Please report via email to: gitdeeper@gmail.com

You should receive a response within 48 hours.

## Security Considerations for IKPS

### Layer Separation

- Strict functional separation prevents cross-layer contamination
- No interference between layer tasks ensures data integrity

### No Archival Principle

- No persistent storage of sensitive dialogue data
- Each snapshot is independent and transient

### No Canonical Reference

- No single source of truth that could be compromised
- System produces only ephemeral projections

### Input Sanitization

- All input is sanitized before entity extraction
- XSS prevention in React components

## Known Vulnerabilities (None)

No security vulnerabilities are currently known.

## Responsible Disclosure

1. Reporter notifies us privately
2. We confirm and develop fix (7-14 days)
3. Fix released with patch version
4. Public disclosure after 30 days

---

**Last updated:** May 2026
