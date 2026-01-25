// react
import * as React from "react";

const Arrow = React.memo(
	({ className }: React.HTMLAttributes<HTMLDivElement>) => (
		<svg
			className={`inline fill-black stroke-[#eeca44] stroke-width-5 ${className}`}
			viewBox="0 0 500 500"
			width="100"
			height="100"
		>
			<title>Arrow</title>
			<path
				d="M 421.991 158.967 L 233.301 7.446 L 233.301 87.49 L 381.968 211.378 L 63.667 211.378 L 63.667 282.852 L 383.875 282.852 L 233.301 408.645 L 233.301 489.645 L 421.991 336.216 L 421.991 158.967 Z"
				transform="matrix(1, 0, 0, 1, -1.4210854715202004e-14, 0)"
			/>
		</svg>
	),
);

Arrow.displayName = "Arrow";

export { Arrow };
