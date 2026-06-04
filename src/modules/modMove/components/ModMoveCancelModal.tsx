// components
import { Button } from "#ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";

const ModMoveCancelModal = () => {
	return (
		<>
			<DialogHeader>
				<DialogTitle>Moving Your Mods...</DialogTitle>
				<DialogDescription />
			</DialogHeader>
			<div className={"h-4 w-64 text-center p-0 my-2 mx-auto"}>
				<p>
					<strong className={"text-red-6"}>Cancelling...</strong>
				</p>
			</div>
			<DialogFooter className="sm:justify-center pb-1">
				<DialogClose
					render={
						<Button type={"button"} variant={"destructive"} disabled={true}>
							Cancel
						</Button>
					}
				/>
			</DialogFooter>
		</>
	);
};

ModMoveCancelModal.displayName = "ModMoveCancelModal";

export { ModMoveCancelModal };
