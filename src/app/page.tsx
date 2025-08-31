'use client';

import {useState} from 'react';
import {Header} from '@/components/common/Header';
import {VehicleSearchForm} from '@/components/search/VehicleSearchForm';
import {SearchResults} from '@/components/search/SearchResults';
import {useToast} from '@/hooks/use-toast';
import type {SearchResult} from '@/lib/types';

type SearchState = {
  results?: (Partial<SearchResult> & {estimation: SearchResult['estimation']})[];
  error?: string;
  message?: string;
};

export default function Home() {
  const [searchState, setSearchState] = useState<SearchState>({});
  const {toast} = useToast();

  const handleSearch = (state: SearchState) => {
    setSearchState(state);

    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: state.error,
      });
    }
    if (state.message) {
      toast({
        title: 'Quick Update',
        description: state.message,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <section className="mb-12">
          <VehicleSearchForm onSearch={handleSearch} />
        </section>
        <section>
          <SearchResults state={searchState} />
        </section>
      </main>
    </div>
  );
}
