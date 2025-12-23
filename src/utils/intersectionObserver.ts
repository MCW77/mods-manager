const observers = new Map<
	Element | Document | null,
	Map<
		string,
		{
			observer: IntersectionObserver;
			elements: Map<Element, (entry: IntersectionObserverEntry) => void>;
		}
	>
>();

export function observe(
	element: Element,
	callback: (entry: IntersectionObserverEntry) => void,
	options: IntersectionObserverInit,
) {
	const root = options.root || null;
	const rootMargin = options.rootMargin || "0px";

	let rootMap = observers.get(root);
	if (!rootMap) {
		rootMap = new Map();
		observers.set(root, rootMap);
	}

	let observerInfo = rootMap.get(rootMargin);
	if (!observerInfo) {
		const elements = new Map<
			Element,
			(entry: IntersectionObserverEntry) => void
		>();
		console.log(
			"Creating new IntersectionObserver for root:",
			root,
			"with margin:",
			rootMargin,
		);
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const cb = elements.get(entry.target);
				if (cb) cb(entry);
			});
		}, options);
		observerInfo = { observer, elements };
		rootMap.set(rootMargin, observerInfo);
	}

	observerInfo.elements.set(element, callback);
	observerInfo.observer.observe(element);

	return () => {
		const rootMap = observers.get(root);
		if (!rootMap) return;
		const observerInfo = rootMap.get(rootMargin);
		if (!observerInfo) return;

		observerInfo.elements.delete(element);
		observerInfo.observer.unobserve(element);
		if (observerInfo.elements.size === 0) {
			observerInfo.observer.disconnect();
			rootMap.delete(rootMargin);
			if (rootMap.size === 0) {
				observers.delete(root);
			}
		}
	};
}
