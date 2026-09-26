Set-Location C:\Users\pc\Documents\GitHub\comptrack
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom --legacy-peer-deps
npx vitest run
git add __tests__ vitest.config.ts vitest.setup.ts
git commit -m "test(comptrack): Vitest EmployesPage et ContratsPage"
git push origin feat/comptrack-v1
