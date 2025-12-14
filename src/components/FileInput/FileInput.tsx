// react
import React, { useRef } from "react";

import { cn } from "#lib/utils";

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
	id: string;
	label: string;
	handler: (f: File) => void;
};

const FileInput = React.memo(
	({
		accept = "",
		className = "",
		icon,
		id,
		label,
		handler,
	}: ComponentProps) => {
		const fileInput = useRef<HTMLInputElement>(null);
		return (
			<div className={cn("relative", className)}>
				<Label htmlFor={id} className={"cursor-pointer w-full block group"}>
					<Button
						className={"pointer-events-none w-full group-hover:bg-primary/90"}
					>
						<FontAwesomeIcon className={"p-r-2"} icon={icon} />
						{label}
					</Button>
				</Label>
				<Input
					accept={accept}
					className={"sr-only"}
					id={id}
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
