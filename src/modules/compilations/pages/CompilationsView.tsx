// react
import { For, observer, useObservable } from "@legendapp/state/react";

// state
import { beginBatch, endBatch } from "@legendapp/state";

import { compilations$ } from "../state/compilations";
import { ui$ } from "#/modules/ui/state/ui";

// components
import { Button } from "#ui/button";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";

const CompilationsView: React.FC = observer(() => {
  const state = useObservable({
    isOpen: false,
    name: "",
    description: "",
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    compilations$.addCompilation(state.name.peek(), state.description.peek(), state.category.peek());
    state.name.set("");
    state.description.set("");
    state.isOpen.set(false);
  };

  return (
    <div className={"flex gap-2 flex-wrap"}>
      <Card key={"***add"} className={"w-[300px] max-h-[30%]"}>
        <CardHeader>
          <CardTitle>{"Add Compilation"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={state.isOpen.get()} onOpenChange={state.isOpen.set}>
            <PopoverTrigger className={"m-auto p-2"} asChild>
              <Button variant={"outline"} className={"w-[80%] h-[80%]"}>
                +
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80"
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                <h4 className="font-medium text-sm text-slate-900">Add compilation</h4>
                <Label htmlFor={"compilation_add_form_name"}>
                  Name
                </Label>
                <Input
                  id="compilation_add_form_name"
                  value={state.name.get()}
                  onChange={(e) => state.name.set(e.target.value)}
                  className="h-8 text-sm"
                />
                <Label htmlFor={"compilation_add_form_description"}>
                  Description
                </Label>
                <Input
                  id="compilation_add_form_description"
                  value={state.description.get()}
                  onChange={(e) => state.description.set(e.target.value)}
                  className="h-8 text-sm"
                />
                <Label htmlFor={"compilation_add_form_category"}>
                  Category
                </Label>
                <Input
                  id="compilation_add_form_category"
                  value={state.category.get()}
                  onChange={(e) => state.category.set(e.target.value)}
                  className="h-8 text-sm"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => state.isOpen.set(false)}
                    className="h-8 px-3 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 px-3 text-xs bg-slate-900 text-white hover:bg-slate-700"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
      <For each={compilations$.compilationByIdForActiveAllycode}>
        {(compilation) => {
          const displayedDate = compilation.lastOptimized.get()?.toLocaleDateString() ?? "never";
          let displayedCategory = compilation.category.get();
          if (displayedCategory === "") displayedCategory = "None";

          return (
            <Card key={compilation.id.get()} className={"w-[300px] max-h-[30%]"}>
              <CardHeader>
                <CardTitle>{compilation.id.get()}</CardTitle>
                <CardDescription>{compilation.description.get()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={"flex gap-2 items-center"}>
                  <Label>
                    Last Run:
                  </Label>
                  <p>{displayedDate}</p>
                </div>
                <div className={"flex gap-2 items-center"}>
                  <Label>
                    Category:
                  </Label>
                  <p>{displayedCategory}</p>
                </div>
                <div className={"flex gap-2 items-center"}>
                  <Label>
                    Unit Count:
                  </Label>
                  <p>{compilation.selectedCharacters.length}</p>
                </div>
                <div className={"flex gap-2 items-center"}>
                  <Button variant={"outline"} onClick={() => compilations$.deleteCompilation(compilation.id.peek())}>
                    Delete
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      beginBatch();
                      compilations$.activeCompilationId.set(compilation.id.peek());
                      compilations$.ensureSelectedCharactersExist(compilation.id.peek());
                      compilations$.defaultCompilation.set(structuredClone(compilation.peek()));
                      compilations$.defaultCompilation.id.set("DefaultCompilation");
                      compilations$.defaultCompilation.category.set("");
                      compilations$.defaultCompilation.description.set("Default compilation used until saved under own name");
                      endBatch();
                      ui$.currentSection.set("optimize");
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        }}
      </For>
    </div>
  );
});

CompilationsView.displayName = "CompilationsView";

export { CompilationsView };
