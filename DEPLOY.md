# 🚀 Deployment Guide for IKPS v1.0.0

## Netlify Deployment (Documentation)

```bash
cd Netlify/
netlify deploy --prod
```

Configuration

· Site name: ikps.netlify.app
· Publish directory: Netlify/

---

GitHub Deployment

```bash
git add .
git commit -m "IKPS v1.0.0: Initial release"
git push origin main
```

---

GitLab Mirror

```bash
git remote add gitlab https://gitlab.com/gitdeeper12/IKPS.git
git push gitlab main
```

---

Development Server

```bash
npm install
npm run dev
```

---

Build for Production

```bash
npm run build
```

---

Verification

```bash
curl https://ikps.netlify.app
```

---

For production deployments, ensure all tests pass and documentation is up to date.
