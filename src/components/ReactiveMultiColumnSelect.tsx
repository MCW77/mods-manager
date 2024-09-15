// state
import { computed, type Observable } from "@legendapp/state";
import { Memo, reactive } from "@legendapp/state/react";

// components
import { ChevronsUpDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@radix-ui/react-collapsible"
import { Button } from "#ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "#ui/select";

const ReactiveSelect = reactive(Select);

interface Group {
	label: string;
	items: { value: string; label: string }[];
}

interface MultiColumnSelectProps {
	groups: Group[];
	selectedValue$: Observable<string>;
}

const ReactiveMultiColumnSelect: React.FC<MultiColumnSelectProps> = ({
	groups,
	selectedValue$,
}) => {
  const items = groups.flatMap((group) => group.items);
	const selectedValue = selectedValue$.get();
  const selectedLabel$ = computed(() => items.find((item) => item.value === selectedValue$.get())?.label ?? "");

	const handleChange = (value: string) => {
		selectedValue$.set(value);
	};

	return (
		<ReactiveSelect $value={selectedValue$} onValueChange={handleChange}>
			<SelectTrigger className={"w-auto h-4 px-2 mx-2 inline-flex"}>
        <Memo>
          {() =>
            <SelectValue>
              {selectedLabel$.get()}
            </SelectValue>
          }
        </Memo>
      </SelectTrigger>
			<SelectContent
        position={"popper"}
        side={"bottom"}
        align={"start"}
        sideOffset={5}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groups.map((group) => (
            <Collapsible key={group.label} defaultOpen={true}>
              <CollapsibleTrigger asChild>
                <div>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                  {group.label}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div>
                  {group.items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
			</SelectContent>
		</ReactiveSelect>
	);
};

ReactiveMultiColumnSelect.displayName = "ReactiveMultiColumnSelect";

export { ReactiveMultiColumnSelect };
