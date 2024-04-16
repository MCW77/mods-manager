// state
import { observable } from "@legendapp/state";

// domain
import { SectionNames } from "../domain/SectionNames";

interface UI {
  currentSection: SectionNames;
  previousSection: SectionNames;
  language: string;
  theme: "dark" | "light";
  goToPreviousSection: () => void;
}

export const ui$ = observable<UI>({
  currentSection: "help" as SectionNames,
  previousSection: "help" as SectionNames,
  language: "en-US",
  theme: "light",
  goToPreviousSection: () => {
    ui$.currentSection.set(ui$.previousSection.peek());
  },
});

ui$.currentSection.onChange(({value, getPrevious}) => {
  ui$.previousSection.set(getPrevious());
});

