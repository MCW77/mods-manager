// components
import { Button } from "#ui/button";

const ModMoveCancelModal = () => {
	return (
		<div className={"flex flex-col gap-2"}>
			<h3>Moving Your Mods...</h3>
			<div className={"h-4 w-64 text-center p-0 my-2 mx-auto"}>
				<p>
					<strong className={"text-red-6"}>Cancelling...</strong>
				</p>
			</div>
			<div className={""}>
				<Button type={"button"} variant={"destructive"} disabled={true}>
					Cancel
				</Button>
			</div>
		</div>
	);
};

ModMoveCancelModal.displayName = "ModMoveCancelModal";

export { ModMoveCancelModal };
