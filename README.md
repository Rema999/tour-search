# Tour Search

Client-side tour search application: destination picker, search via the provided API, and results displayed as price-sorted cards.

## Live Demo

The application is deployed on Firebase Hosting and can be accessed here:

https://tour-search-21731.web.app

## Requirements

- Node.js 20.17.0
- pnpm

## Local run

```bash
pnpm install
pnpm start
```

Open [http://localhost:3000](http://localhost:3000); the app redirects to [http://localhost:3000/tour-search](http://localhost:3000/tour-search).

## Build & scripts

```bash
pnpm build    # production build
pnpm lint     # lint
pnpm lint-fix # lint with auto-fix
```

## Architecture

- **Shared UI** — Reusable primitives in `src/shared/ui`: `Button`, `Input`, `Combobox`, `Spinner`, `Card`, `EmptyState`, `ErrorState`. No UI library; all controls are custom.

- **Destination search** — Feature in `src/features/destination-search`: countries list and geo search, mapped to a single `DestinationOption` model (country / city / hotel). `DestinationCombobox` composes the generic `Combobox` with destination-specific display and type indicators.

- **Tours search service** — In `src/features/tours-search`: `searchToursService` runs the flow (start search, wait, poll, retries, optional cancellation via `stopSearchPrices`). No tokens or polling logic in UI; components only trigger search and show state.

- **Aggregation** — `toursAggregator` loads hotels by country, merges with raw prices by `hotel_id`, sorts by price, and maps to `TourCardViewModel[]`. UI receives ready view models; no aggregation in components.

- **React Query** — Server state lives in TanStack Query. Search is mutation-driven; results are cached by `countryId`. A dedicated query reads from that cache for the current display destination.

**Caching and display filtering:** The API searches by `countryId` only. Results are therefore cached per country. When the user selects a country, city, or hotel, the same cached country-level result is reused. Display-level filtering (in `filterToursByDestination`) then narrows the list by the selected destination type (country → full list, city → by `cityId`, hotel → by `hotelId`). So one backend search per country supports all destination granularities without extra requests.

## API

All data calls go through `src/shared/api/toursApi.ts`, which wraps the project’s `api.js`. Used methods include `getCountries`, `searchGeo`, `startSearchPrices`, `getSearchPrices`, `stopSearchPrices`, `getHotels`, etc. See the API contract documentation for request/response shapes.

## Possible Improvements

- **E2E tests** — Add Playwright or Cypress to verify the full search flow from UI to API.
- **Result virtualization** — Implement a virtualized list (e.g. react-window) for large result sets; currently all visible cards are rendered.
- **Request caching** — Search results are already cached per `countryId` via React Query; consider extending (e.g. persistence, tuning staleTime) or applying similar caching to other endpoints if needed.
- **Accessibility** — Basic ARIA and keyboard support exist (combobox, listbox, label association); further improve with additional attributes and full keyboard coverage where needed.
- **Error Boundary** — Add a React Error Boundary to isolate runtime errors and show a fallback UI instead of a blank screen.
