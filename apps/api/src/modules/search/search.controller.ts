import { Controller, Get, Query } from '@nestjs/common';
import type { SearchResultItem } from '@hive/types';

@Controller('search')
export class SearchController {
  @Get('global')
  globalSearch(@Query('q') query: string = ''): { results: SearchResultItem[] } {
    // In Phase 0, returns structured search schema items
    const sampleResults: SearchResultItem[] = [
      {
        id: 'c1',
        category: 'CUSTOMER',
        title: 'Eleanor Vance',
        subtitle: '+1 (555) 234-5678 • 8 visits',
        badge: 'VIP',
      },
      {
        id: 'a1',
        category: 'APPOINTMENT',
        title: 'Signature Blowdry — Eleanor Vance',
        subtitle: 'Today @ 2:30 PM • Sophia Miller',
        badge: 'Confirmed',
      },
      {
        id: 'p1',
        category: 'PRODUCT',
        title: 'Olaplex No. 3 Hair Perfector',
        subtitle: 'SKU: OLA-003 • In Stock: 18 units',
        badge: 'In Stock',
      },
    ];

    if (!query) {
      return { results: sampleResults };
    }

    const q = query.toLowerCase();
    const filtered = sampleResults.filter(
      (r) => r.title.toLowerCase().includes(q) || r.subtitle?.toLowerCase().includes(q)
    );

    return { results: filtered };
  }
}
