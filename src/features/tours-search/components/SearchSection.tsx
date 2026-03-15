import { FC, useState, useEffect } from "react";
import { Button, Spinner, EmptyState, ErrorState } from "@/shared/ui";
import type { DestinationOption } from "@/features/destination-search";
import { TourList } from "@/features/tours-results";
import { getCountryIdFromDestination } from "../searchToursService";
import { useTourSearch } from "../hooks/useTourSearch";
import { SearchForm } from "./SearchForm";
import styles from "./SearchSection.module.css";

const INITIAL_PAGE_SIZE = 6;
const PAGE_SIZE = 6;

export const SearchSection: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationOption | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  const {
    search,
    tours,
    loading,
    error,
    hasSearched,
    loadingForCountryId,
  } = useTourSearch();

  const currentCountryId = getCountryIdFromDestination(selectedDestination);
  const isSubmitting =
    loading && currentCountryId !== null && currentCountryId === loadingForCountryId;

  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [tours]);

  const handleSubmit = () => {
    search(selectedDestination);
  };

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Форма пошуку турів</h2>
        <SearchForm
          selectedDestination={selectedDestination}
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          onSelect={(d) => {
            setSelectedDestination(d);
            setInputValue(d?.label ?? "");
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      {loading && (
        <div className={styles.loading}>
          <Spinner size="sm" />
          <span>Пошук турів…</span>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <ErrorState message={error.message} />
        </div>
      )}

      {hasSearched && !loading && !error && tours.length === 0 && (
        <div className={styles.empty}>
          <EmptyState title="За вашим запитом турів не знайдено" />
        </div>
      )}

      {!loading && !error && tours.length > 0 && (
        <div className={styles.results}>
          <TourList cards={tours.slice(0, visibleCount)} />
          {tours.length > visibleCount && (
            <div className={styles.showMoreWrap}>
              <Button
                type="button"
                className={styles.showMoreBtn}
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              >
                Показати ще
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
