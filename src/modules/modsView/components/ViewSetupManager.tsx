// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { For, reactive, Show } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import { builtinViewSetups } from "../domain/ModsViewOptions";

// components
import { Button } from "#ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { RenameButton } from "#/components/RenameButton";
import { TrashIcon } from "lucide-react";

const ReactiveSelect = reactive(Select);

const ViewSetupManager = React.memo(() => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"flex items-center"}>
			<ReactiveSelect
				$value={modsView$.idOfActiveViewSetupInActiveCategory}
				onValueChange={(value) => {
					modsView$.idOfActiveViewSetupInActiveCategory.set(value);
				}}
			>
				<SelectTrigger
					className={"h-4 px-2 mx-2 inline-flex"}
					id={"view-setup"}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent position={"popper"} sideOffset={5}>
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
