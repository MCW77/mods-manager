// react
import React from "react";

// state
import { For, Show } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// domain
import { builtinViewSetups } from "../domain/ModsViewOptions";

// components
import { TrashIcon } from "lucide-react";
import { Button } from "#ui/button";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Select as ReactiveSelect } from "#/components/reactive/Select";
import { RenameButton } from "#/components/RenameButton";

const ViewSetupManager = React.memo(() => {
	return (
		<div className={"flex items-center"}>
			<ReactiveSelect $value={modsView$.idOfActiveViewSetupInActiveCategory}>
				<SelectTrigger
					className={"h-4 px-2 mx-2 inline-flex"}
					id={"view-setup"}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent sideOffset={5}>
					<For each={modsView$.viewSetupByIdInActiveCategory}>
						{(setup$) => {
							const id = setup$.id.peek();
							return (
								<div className="flex items-center">
									<SelectItem key={id} value={id}>
										{id}
									</SelectItem>
									<Show if={() => !builtinViewSetups.includes(id)}>
										<RenameButton
											itemId={id}
											itemName={id}
											onRename={(itemId, newName) =>
												modsView$.renameViewSetup(itemId, newName)
											}
										/>
										<Button
											size={"icon"}
											variant={"ghost"}
											onClick={(event) => {
												event.stopPropagation();
												modsView$.removeViewSetup(id);
											}}
										>
											<TrashIcon className="h-3 w-3 text-muted-foreground" />
										</Button>
									</Show>
								</div>
							);
						}}
					</For>
				</SelectContent>
			</ReactiveSelect>
			<Button
				size={"xs"}
				variant={"outline"}
				onClick={() => modsView$.addViewSetup()}
			>
				+
			</Button>
		</div>
	);
});

ViewSetupManager.displayName = "ViewSetupManager";

export default ViewSetupManager;
