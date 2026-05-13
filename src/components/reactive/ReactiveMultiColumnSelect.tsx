// react
import type { ReactElement } from "react";

// state
import { Memo } from "@legendapp/state/react";

// components
import { ChevronsUpDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { Button } from "#ui/button";
import {
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectValue,
	SelectGroup,
} from "#ui/select";

import {
	Select as ReactiveSelect,
	type SelectProps,
} from "#/components/reactive/Select";

type MultiColumnSelectItem<Value extends string> = {
	label: string;
	value: Value;
};

type MultiColumnSelectGroup<Value extends string> = {
	label: string;
	items: MultiColumnSelectItem<Value>[];
};

type ReactiveMultiColumnSelectProps<
	Value extends string,
	Multiple extends boolean | undefined = false,
> = Omit<SelectProps<Value, Multiple>, "items"> & {
	groups: MultiColumnSelectGroup<Value>[];
	triggerProps?: React.ComponentPropsWithoutRef<typeof SelectTrigger>;
};

function ReactiveMultiColumnSelect<
	Value extends string,
	Multiple extends boolean | undefined = false,
>(props: ReactiveMultiColumnSelectProps<Value, Multiple>): ReactElement {
	const items = props.groups.flatMap((group) => group.items);
	if (!Array.isArray(props.groups) || props.groups.length === 0) {
		return <> </>;
	}

	const newProps = {
		...props,
		items,
	};

	return (
		<ReactiveSelect {...newProps}>
			<SelectTrigger
				className={"w-auto h-4 px-2 mx-2 inline-flex"}
				{...props.triggerProps}
			>
				<Memo>{() => <SelectValue />}</Memo>
			</SelectTrigger>
			<SelectContent
				alignItemWithTrigger={true}
				side={"bottom"}
				align={"start"}
				sideOffset={5}
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{props.groups.map((group) => (
						<SelectGroup key={group.label}>
							<Collapsible key={group.label} defaultOpen={true}>
								<CollapsibleTrigger asChild>
									<div>
										<Button variant="ghost" size="sm" className="w-9 p-0">
											<ChevronsUpDown className="h-4 w-4" />
											<span className="sr-only">Toggle</span>
										</Button>
										<SelectLabel>{group.label}</SelectLabel>
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
						</SelectGroup>
					))}
				</div>
			</SelectContent>
		</ReactiveSelect>
	);
}

export { ReactiveMultiColumnSelect, type MultiColumnSelectGroup };
