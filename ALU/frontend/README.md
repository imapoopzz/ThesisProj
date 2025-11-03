# ALU Frontend

A React single-page application that recreates the ALUzon member experience using the reference layouts exported from Figma. The UI is organised around user-side pages for registration, authentication, dashboard, dues tracking, membership profile management, and benefits discovery.

## Structure

- `src/App.js` wires React Router routes and application state.
- `src/components/` contains shared layout primitives (`AppLayout`, `InfoCard`).
- `User Side/pages/` holds all JSX page implementations.
- `User Side/styles/` holds the matching CSS for each page and shared form/layout helpers.
- `src/api/` provides Axios clients ready to connect to the Express backend once endpoints are live.

## Scripts

- `npm start` – run the development server on [http://localhost:3000](http://localhost:3000)
- `npm test` – run the Jest test suite
- `npm run build` – generate a production build in `build/`

## Environment

Copy `.env.example` to `.env` and set `REACT_APP_API_URL` to the backend address, e.g.

```bash
REACT_APP_API_URL=http://localhost:5000
```

## Design Notes

- Styling is CSS-based (no Tailwind dependency) but mirrors the Figma spacing, colour palette, and typography.
- Navigation is responsive: a persistent sidebar on desktop and a bottom nav on mobile.
- Authentication, membership, dues, and news use mock data but integrate with the Axios layer for an easy swap to live endpoints.
