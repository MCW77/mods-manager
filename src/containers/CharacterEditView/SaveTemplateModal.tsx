// react
import { useDispatch } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { Computed, Show, observer, reactive } from "@legendapp/state/react";

// state
import { dialog$ } from "#/modules/dialog/state/dialog";
import { templates$ } from "#/modules/templates/state/templates";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";

// components
import { Button } from "#ui/button";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

const ReactiveInput = reactive(Input);
const ReactiveSelect = reactive(Select);

const SaveTemplateModal: React.FC = observer(() => {
	const dispatch: ThunkDispatch = useDispatch();

	return (
		<div className={"flex flex-col gap-2"}>
			<h3>Please enter a name for this character template</h3>
			<Computed>
				{() => (
					<div>
						<ReactiveInput
							type={"text"}
							id={"template-name"}
							placeholder={"Template Name"}
							$value={templates$.id}
							onChange={(event) => {
								templates$.id.set(event.target.value);
							}}
						/>
						<div>
							<Label htmlFor={"template-category"}>Category</Label>
							<ReactiveSelect
								$value={templates$.category}
								onValueChange={(value: string) => {
									templates$.category.set(value);
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{templates$.categories.get().map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</ReactiveSelect>
							<ReactiveInput
								type={"text"}
								id={"template-category"}
								placeholder={"Template Category"}
								$value={templates$.category}
								onChange={(event) => {
									templates$.category.set(event.target.value);
								}}
							/>
						</div>
					</div>
				)}
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
			<div className={"flex gap-2 justify-center"}>
				<Button type={"button"} onClick={() => dialog$.hide()}>
					Cancel
				</Button>
				<Button
					type={"button"}
					disabled={!templates$.isUnique.get() || templates$.id.get() === ""}
					onClick={() => {
						dialog$.hide();
						dispatch(
							CharacterEdit.thunks.saveTemplate(
								templates$.id.get(),
								templates$.category.get(),
							),
						);
					}}
				>
					Save
				</Button>
			</div>
		</div>
	);
});

SaveTemplateModal.displayName = "SaveTemplateModal";

export { SaveTemplateModal };
