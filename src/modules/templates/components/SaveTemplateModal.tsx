// react
import { Computed, Show, observer, useValue } from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const templates$ = stateLoader$.templates$;

// components
import { Input } from "#/components/reactive/Input";
import { Select as ReactiveSelect } from "#/components/reactive/Select";

import { Button } from "#ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";
import { Label } from "#ui/label";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

const SaveTemplateModal: React.FC = observer(() => {
	const cannotSaveTemplate = useValue(
		() => !templates$.isUnique.get() || templates$.id.get() === "",
	);
	const templatesCategories = useValue(templates$.categories);

	return (
		<>
			<DialogHeader>
				<DialogTitle>Save Template</DialogTitle>
				<DialogDescription>
					Please enter a name (and category) for this character template
				</DialogDescription>
			</DialogHeader>
			<Computed>
				<div>
					<Input
						type={"text"}
						id={"template-name"}
						placeholder={"Template Name"}
						$value={templates$.id}
					/>
					<div>
						<Label htmlFor={"template-category"}>Category</Label>
						<ReactiveSelect $value={templates$.category}>
							<SelectTrigger className={"w-full"}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{templatesCategories.map((category) => (
									<Show key={category} if={category !== ""}>
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									</Show>
								))}
							</SelectContent>
						</ReactiveSelect>
						<Input
							type={"text"}
							id={"template-category"}
							placeholder={"Template Category"}
							$value={templates$.category}
						/>
					</div>
				</div>
			</Computed>
			<Show
				if={templates$.isUnique}
				else={
					<p className={"text-red-600"}>
						That name has already been taken. Please use a different name.
					</p>
				}
			>
				<p />
			</Show>
			<DialogFooter className="sm:justify-center pb-1">
				<DialogClose render={<Button type={"button"}>Cancel</Button>} />
				<DialogClose
					render={
						<Button
							type={"button"}
							disabled={cannotSaveTemplate}
							onClick={() => {
								templates$.saveTemplate();
							}}
						>
							Save
						</Button>
					}
				/>
			</DialogFooter>
		</>
	);
});

SaveTemplateModal.displayName = "SaveTemplateModal";

export default SaveTemplateModal;
