import { useEffect, useRef } from "react";

export function useRenderCount(name?: string): number {
	const count = useRef(1);

	useEffect(() => {
		count.current += 1;
	});

	console.log(`${name || "RenderCount"}: ${count.current}`);

	return count.current;
}
