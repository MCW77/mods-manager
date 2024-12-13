/*
import { useState, useEffect, Fragment } from "react";

export const useLazyComponentLoader = <T extends React.ComponentType<object>>(
	load: () => Promise<{ [key: string]: any }>,
	name: string,
) => {
	const [Component, setComponent] = useState<T>(Fragment);

	useEffect(() => {
		let isMounted = true;
		load()
			.then((module) => {
				if (isMounted) {
					const LoadedComponent = module[name];
					if (LoadedComponent) {
						console.log(`Loaded component: ${name}`);
						setComponent(() => LoadedComponent);
					} else {
						console.error(`Component ${name} not found in module`);
					}
				}
			})
			.catch((error) => {
				console.error(`Error loading component: ${name}`, error);
			});
		return () => {
			isMounted = false;
		};
	}, [load, name]);

	return Component;
};
*/
