// react
import React, { useRef } from "react";

import { cn } from "#lib/shadcn"

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type ComponentProps = {
	accept?: string;
	className?: string;
	icon: IconDefinition;
	label: string;
	handler: (f: File) => void;
};

const FileInput = React.memo(
	({ accept = "", className = "", icon, label, handler }: ComponentProps) => {
		const fileInput = useRef<HTMLInputElement>(null);
		return (
			<div className={cn("relative", className)}>
				<Label
					htmlFor="file-input"
					className={"cursor-pointer w-full block group"}
				>
					<Button
						className={
							"pointer-events-none w-full group-hover:bg-slate-900/90 dark:group-hover:bg-slate-50/90"
						}
					>
						<FontAwesomeIcon className={"p-r-2"} icon={icon} />
						{label}
					</Button>
				</Label>
				<Input
					accept={accept}
					className={"sr-only"}
					id="file-input"
					ref={fileInput}
					type="file"
					onChange={() => {
						if (fileInput.current?.files) {
							handler(fileInput.current.files[0]);
						}
					}}
				/>
			</div>
		);
	},
);

FileInput.displayName = "FileInput";

export { FileInput };
