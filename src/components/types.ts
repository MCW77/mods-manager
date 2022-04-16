export type Sections = 
  | 'explore'
  | 'optimize'
  | 'settings'
  | 'help'
  | 'about'
;

export type DOMContent =
  | string
  | JSX.Element
  | JSX.Element[]
;