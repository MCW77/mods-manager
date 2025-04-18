// state
import { observer, use$, useObservable } from "@legendapp/state/react";

// components
import { PencilIcon } from "lucide-react";
import { Button } from "#ui/button";
import { Input } from "#ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover";

interface RenameButtonProps {
	itemId: string;
	itemName: string;
	onRename: (id: string, newName: string) => void;
}

const RenameButton: React.FC<RenameButtonProps> = observer(
	({ itemId, itemName, onRename }: RenameButtonProps) => {
		const state$ = useObservable({
			isOpen: false,
			newName: itemName,
		});
		const isPopoverOpen = use$(state$.isOpen);
		const newName = use$(state$.newName);

		const handleRename = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			state$.isOpen.set(true);
		};

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			onRename(itemId, newName);
			state$.isOpen.set(false);
		};

		return (
			<Popover open={isPopoverOpen} onOpenChange={state$.isOpen.set}>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6 p-0 hover:bg-foreground focus-visible:ring-1 focus-visible:ring-nuted-foreground focus-visible:ring-offset-2 focus-visible:ring-muted-foreground"
						onClick={handleRename}
						onMouseDown={(e) => e.stopPropagation()}
					>
						<PencilIcon className="h-3 w-3 text-muted-foreground" />
						<span className="sr-only">Rename {itemName}</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-80"
					onPointerDownOutside={(e) => e.preventDefault()}
				>
					<form onSubmit={handleSubmit} className="flex flex-col space-y-2">
						<h4 className="font-medium text-sm text-popover">Rename Item</h4>
						<Input
							value={newName}
							onChange={(e) => state$.newName.set(e.target.value)}
							placeholder="Enter new name"
							className="h-8 text-sm"
						/>
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => state$.isOpen.set(false)}
								className="h-8 px-3 text-xs"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								size="sm"
								className="h-8 px-3 text-xs bg-primary-foreground text-primary hover:bg-accent"
							>
								Save
							</Button>
						</div>
					</form>
				</PopoverContent>
			</Popover>
		);
	},
);

RenameButton.displayName = "RenameButton";

export { RenameButton };
