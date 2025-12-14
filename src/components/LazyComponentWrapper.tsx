/*
// react
import type React from "react";

// hooks
import { useLazyComponentLoader } from "#/hooks/useLazyComponentLoader";

// components
import { Spinner } from "#/components/Spinner/Spinner";

interface LazyComponentWrapperProps {
	load: () => Promise<{ [key: string]: React.ComponentType<object> }>;
	name: string;
}

const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({
	load,
	name,
}) => {
	const Component = useLazyComponentLoader(load, name);

	if (!Component) {
		console.log(`Component ${name} is not yet loaded`);
		return <Spinner isVisible={true} />;
	}

	console.log(`Rendering component ${name}`);
	return <Component />;
};

export default LazyComponentWrapper;
*/
