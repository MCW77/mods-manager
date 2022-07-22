type ShowOptions = 'upgrades'| 'change' | 'all';
type SortOptions = 'currentCharacter' | 'assignedCharacter';
type ViewOptions = 'list' | 'sets';

interface ModListFilter {
  show: ShowOptions;
  sort: SortOptions;
  tag: string;
  view: ViewOptions;

}


export type { ModListFilter };
