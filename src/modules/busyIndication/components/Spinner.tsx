// state
import { Show, useValue } from "@legendapp/state/react";

import { isBusy$ } from "../state/isBusy.js";

// styles
import "./Spinner.css";

const Spinner = () => {
	const isBusy = useValue(isBusy$);

	return (
		<Show if={isBusy}>
			<div
				className={`absolute inset-0 bg-black/50 m-0 p-2 z-300 text-center
          before:content-[''] before:inline-block before:h-full before:align-middle
        `}
			>
				<div
					className={`inline-block align-middle rounded-[100%] w-[5em] h-[5em] border-y-[#eeca44] border-x-transparent border-4 border-solid relative animate-[2s_linear_spin-slow_infinite] box-border
            after:content-[''] after:absolute after:top-[50%] after:left-[50%] after:h-[4em] after:w-[4em] after:m-l-[-2em] after:m-t-[-2em] after:rounded-[100%] after:border-y-[#a35ef9] after:border-x-transparent after:border-4 after:border-solid after:animate-[1s_linear_spin-slow-reverse_infinite] after:box-border
          `}
				/>
			</div>
		</Show>
	);
};

Spinner.displayName = "Spinner";

export { Spinner };
