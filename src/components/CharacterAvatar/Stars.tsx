// react
import * as React from "react";

const activeStarStyle =
	"block absolute top-[41.66%] left-[41.66%] size-[16.66%] bg-contain bg-no-repeat bg-[url(/img/star-active.webp)] transform";
const inactiveStarStyle =
	"block absolute top-[41.66%] left-[41.66%] size-[16.66%] bg-contain bg-no-repeat bg-[url(/img/star-passive.webp)] transform";

const ActiveStar1 = React.memo(() => (
	<div
		className={`${activeStarStyle} [transform:rotate(-70deg)_translateY(-350%)]`}
	/>
));

const ActiveStar2 = React.memo(() => (
	<div
		className={`${activeStarStyle} [transform:rotate(-47deg)_translateY(-350%)]`}
	/>
));

const ActiveStar3 = React.memo(() => (
	<div
		className={`${activeStarStyle} [transform:rotate(-23deg)_translateY(-350%)]`}
	/>
));

const ActiveStar4 = React.memo(() => (
	<div
		className={`${activeStarStyle} [transform:rotate(0deg)_translateY(-350%)]`}
	/>
));

const ActiveStar5 = React.memo(() => (
	<div
		className={`${activeStarStyle} [transform:rotate(23deg)_translateY(-350%)]`}
	/>
));

const ActiveStar6 = React.memo(() => (
	<div
		className={`${activeStarStyle} [transform:rotate(47deg)_translateY(-350%)]`}
	/>
));

const ActiveStar7 = React.memo(() => (
	<div
		className={`${activeStarStyle} [transform:rotate(70deg)_translateY(-350%)]`}
	/>
));

const InactiveStar1 = React.memo(() => (
	<div
		className={`${inactiveStarStyle} [transform:rotate(-70deg)_translateY(-350%)]`}
	/>
));
const InactiveStar2 = React.memo(() => (
	<div
		className={`${inactiveStarStyle} [transform:rotate(-47deg)_translateY(-350%)]`}
	/>
));
const InactiveStar3 = React.memo(() => (
	<div
		className={`${inactiveStarStyle} [transform:rotate(-23deg)_translateY(-350%)]`}
	/>
));
const InactiveStar4 = React.memo(() => (
	<div
		className={`${inactiveStarStyle} [transform:rotate(0deg)_translateY(-350%)]`}
	/>
));
const InactiveStar5 = React.memo(() => (
	<div
		className={`${inactiveStarStyle} [transform:rotate(23deg)_translateY(-350%)]`}
	/>
));
const InactiveStar6 = React.memo(() => (
	<div
		className={`${inactiveStarStyle} [transform:rotate(47deg)_translateY(-350%)]`}
	/>
));
const InactiveStar7 = React.memo(() => (
	<div
		className={`${inactiveStarStyle} [transform:rotate(70deg)_translateY(-350%)]`}
	/>
));

const Stars0 = React.memo(() => (
	<>
		<InactiveStar1 />
		<InactiveStar2 />
		<InactiveStar3 />
		<InactiveStar4 />
		<InactiveStar5 />
		<InactiveStar6 />
		<InactiveStar7 />
	</>
));

const Stars1 = React.memo(() => (
	<>
		<ActiveStar1 />
		<InactiveStar2 />
		<InactiveStar3 />
		<InactiveStar4 />
		<InactiveStar5 />
		<InactiveStar6 />
		<InactiveStar7 />
	</>
));
const Stars2 = React.memo(() => (
	<>
		<ActiveStar1 />
		<ActiveStar2 />
		<InactiveStar3 />
		<InactiveStar4 />
		<InactiveStar5 />
		<InactiveStar6 />
		<InactiveStar7 />
	</>
));
const Stars3 = React.memo(() => (
	<>
		<ActiveStar1 />
		<ActiveStar2 />
		<ActiveStar3 />
		<InactiveStar4 />
		<InactiveStar5 />
		<InactiveStar6 />
		<InactiveStar7 />
	</>
));
const Stars4 = React.memo(() => (
	<>
		<ActiveStar1 />
		<ActiveStar2 />
		<ActiveStar3 />
		<ActiveStar4 />
		<InactiveStar5 />
		<InactiveStar6 />
		<InactiveStar7 />
	</>
));
const Stars5 = React.memo(() => (
	<>
		<ActiveStar1 />
		<ActiveStar2 />
		<ActiveStar3 />
		<ActiveStar4 />
		<ActiveStar5 />
		<InactiveStar6 />
		<InactiveStar7 />
	</>
));
const Stars6 = React.memo(() => (
	<>
		<ActiveStar1 />
		<ActiveStar2 />
		<ActiveStar3 />
		<ActiveStar4 />
		<ActiveStar5 />
		<ActiveStar6 />
		<InactiveStar7 />
	</>
));
const Stars7 = React.memo(() => (
	<>
		<ActiveStar1 />
		<ActiveStar2 />
		<ActiveStar3 />
		<ActiveStar4 />
		<ActiveStar5 />
		<ActiveStar6 />
		<ActiveStar7 />
	</>
));

export { Stars0, Stars1, Stars2, Stars3, Stars4, Stars5, Stars6, Stars7 };
