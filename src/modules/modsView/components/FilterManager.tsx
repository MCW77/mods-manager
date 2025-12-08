// react
import React from "react";

// state
import {
	For,
	observer,
	reactive,
	Show,
	useValue,
} from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const modsView$ = stateLoader$.modsView$;

// domain
import { builtinFilters } from "../domain/ModsViewOptions.js";

// components
import { TrashIcon } from "lucide-react";
import { Button } from "#ui/button.jsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select.jsx";
import { RenameButton } from "#/components/RenameButton.jsx";

const ReactiveSelect = reactive(Select);

const FilterManager = observer(
	React.memo(() => {
		const _activeViewSetupInActiveCategory = useValue(
			modsView$.activeViewSetupInActiveCategory,
		);
		const idOfSelectedFilterInActiveCategory = useValue(
			modsView$.idOfSelectedFilterInActiveCategory,
		);

		return (
			<div className={"flex items-center"}>
				<ReactiveSelect
					$value={() => idOfSelectedFilterInActiveCategory}
					onValueChange={(value) => {
						modsView$.idOfSelectedFilterInActiveCategory.set(value);
					}}
				>
					<SelectTrigger
						className={"h-4 px-2 mx-2 inline-flex"}
						id={"selected-filter"}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent position={"popper"} sideOffset={5}>
						{
							<For each={modsView$.activeViewSetupInActiveCategory.filterById}>
								{(filter$) => {
									const id = filter$.id.get();
									return (
										<div className="flex items-center">
											<SelectItem key={id} value={id}>
												{id}
											</SelectItem>
											<Show if={() => !builtinFilters.includes(id)}>
												<RenameButton
													itemId={id}
													itemName={id}
													onRename={(itemId, newName) =>
														modsView$.renameFilter(itemId, newName)
													}
												/>
												<Button
													size={"icon"}
													variant={"ghost"}
													onClick={(event) => {
														event.stopPropagation();
														modsView$.removeFilter(id);
													}}
												>
													<TrashIcon className="h-3 w-3 text-muted-foreground" />
												</Button>
											</Show>
										</div>
									);
								}}
							</For>
						}
						<SelectItem
							className={"w-40"}
							key={"QuickFilter"}
							value={"QuickFilter"}
						>
							{"QuickEdit"}
						</SelectItem>
					</SelectContent>
				</ReactiveSelect>
				<Button
					size={"xs"}
					variant={"outline"}
					onClick={() => modsView$.addFilter()}
				>
					+
				</Button>
			</div>
		);
	}),
);

FilterManager.displayName = "FilterManager";

export default FilterManager;
