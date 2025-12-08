// react
import { useId } from "react";
import { For, observer, useValue, useObservable } from "@legendapp/state/react";

// state
import { beginBatch, endBatch } from "@legendapp/state";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const compilations$ = stateLoader$.compilations$;

import { ui$ } from "#/modules/ui/state/ui.js";

// components
import { Button } from "#ui/button.jsx";
import { Input } from "#ui/input.jsx";
import { Label } from "#ui/label.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover.jsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.jsx";

const CompilationsView: React.FC = observer(() => {
	const state$ = useObservable({
		isOpen: false,
		name: "",
		description: "",
		category: "",
	});
	const nameId = useId();
	const descriptionId = useId();
	const categoryId = useId();
	const isFormOpen = useValue(state$.isOpen);
	const name = useValue(state$.name);
	const description = useValue(state$.description);
	const category = useValue(state$.category);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		compilations$.addCompilation(
			state$.name.peek(),
			state$.description.peek(),
			state$.category.peek(),
		);
		state$.name.set("");
		state$.description.set("");
		state$.isOpen.set(false);
	};

	return (
		<div className={"grid gap-2 grid-flow-col"}>
			<Card key={"***add"} className={"w-[250px] max-h-[25%]"}>
				<CardHeader>
					<CardTitle>{"Add Compilation"}</CardTitle>
				</CardHeader>
				<CardContent className={"h-full flex items-center justify-center"}>
					<Popover open={isFormOpen} onOpenChange={state$.isOpen.set}>
						<PopoverTrigger className={"m-auto p-2"} asChild>
							<Button variant={"outline"} className={"w-[86%] h-[60%] p-4"}>
								+
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-80"
							onPointerDownOutside={(e) => e.preventDefault()}
						>
							<form onSubmit={handleSubmit} className="flex flex-col space-y-2">
								<h4 className="font-medium text-sm text-primary-foreground">
									Add compilation
								</h4>
								<Label htmlFor={`compilation_add_form_name${nameId}`}>
									Name
								</Label>
								<Input
									id={`compilation_add_form_name${nameId}`}
									value={name}
									onChange={(e) => state$.name.set(e.target.value)}
									className="h-8 text-sm"
								/>
								<Label
									htmlFor={`compilation_add_form_description${descriptionId}`}
								>
									Description
								</Label>
								<Input
									id={`compilation_add_form_description${descriptionId}`}
									value={description}
									onChange={(e) => state$.description.set(e.target.value)}
									className="h-8 text-sm"
								/>
								<Label htmlFor={`compilation_add_form_category${categoryId}`}>
									Category
								</Label>
								<Input
									id={`compilation_add_form_category${categoryId}`}
									value={category}
									onChange={(e) => state$.category.set(e.target.value)}
									className="h-8 text-sm"
								/>
								<div className="flex justify-end space-x-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => state$.isOpen.set(false)}
									>
										Cancel
									</Button>
									<Button type="submit" size="sm">
										Save
									</Button>
								</div>
							</form>
						</PopoverContent>
					</Popover>
				</CardContent>
			</Card>
			<For each={compilations$.compilationByIdForActiveAllycode}>
				{(compilation$) => {
					const compilation = useValue(compilation$);
					const displayedDate =
						compilation.lastOptimized?.toLocaleDateString() ?? "never";
					let displayedCategory = compilation.category;
					if (displayedCategory === "") displayedCategory = "None";

					return (
						<Card
							key={compilation.id}
							className={
								"w-[250px] max-h-[25%] flex flex-col gap-2 items-stretch"
							}
						>
							<CardHeader>
								<CardTitle className={"wrap-anywhere"}>
									{compilation.id}
								</CardTitle>
								<CardDescription className={"wrap-anywhere"}>
									{compilation.description}
								</CardDescription>
							</CardHeader>
							<CardContent className={"h-full"}>
								<div className={"h-full flex flex-col gap-4"}>
									<div className={"flex flex-col gap-2"}>
										<div className={"flex gap-2 items-center"}>
											<Label>Last Run:</Label>
											<p>{displayedDate}</p>
										</div>
										<div className={"flex gap-2 items-center"}>
											<Label>Category:</Label>
											<p className={"wrap-anywhere"}>{displayedCategory}</p>
										</div>
										<div className={"flex gap-2 items-center"}>
											<Label>Unit Count:</Label>
											<p>{compilation$.selectedCharacters.length}</p>
										</div>
									</div>
									<div
										className={"h-full flex gap-2 items-end justify-between"}
									>
										<Button
											variant={"outline"}
											onClick={() => {
												beginBatch();
												compilations$.activeCompilationId.set(
													compilation$.id.peek(),
												);
												compilations$.ensureSelectedCharactersExist(
													compilation$.id.peek(),
												);
												compilations$.defaultCompilation.set(
													structuredClone(compilation$.peek()),
												);
												compilations$.defaultCompilation.id.set(
													"DefaultCompilation",
												);
												compilations$.defaultCompilation.category.set("");
												compilations$.defaultCompilation.description.set(
													"Default compilation used until saved under own name",
												);
												endBatch();
												ui$.currentSection.set("optimize");
											}}
										>
											Edit
										</Button>
										<Button
											variant={"destructive"}
											onClick={() =>
												compilations$.deleteCompilation(compilation$.id.peek())
											}
										>
											Delete
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				}}
			</For>
		</div>
	);
});

CompilationsView.displayName = "CompilationsView";

export default CompilationsView;
