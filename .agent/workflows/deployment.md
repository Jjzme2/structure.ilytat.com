---
description: how to deploy the application to heroku
---

# Heroku Deployment Workflow

Follow these steps to deploy ILYTAT HQ to Heroku.

## 1. Prepare for Deployment
Ensure your local environment is clean and all changes are committed.

```bash
npm run build
```
Verify that the `.output` directory is generated.

## 2. Heroku CLI Setup
Login to your Heroku account via the terminal.

```bash
heroku login
```

## 3. Create Heroku App
If you haven't already, create a new Heroku app.

```bash
heroku create hq-ilytat-com
```

## 4. Set Environment Variables
You MUST set all variables listed in [.env.example](file:///home/jj/Desktop/structure.ilytat.com/.env.example) in the Heroku Dashboard (Settings > Config Vars).

Example for a single variable:
```bash
heroku config:set FIREBASE_PROJECT_ID=your-project-id
```

> [!IMPORTANT]
> For `FIREBASE_ADMIN_PRIVATE_KEY`, ensure it contains the `\n` characters as expected by the environment loader.

## 5. Deploy
Push your code to the Heroku remote.

```bash
git push heroku main
```

## 6. Verify
Open your app in the browser.

```bash
heroku open
```
Check logs if there are issues:
```bash
heroku logs --tail
```
