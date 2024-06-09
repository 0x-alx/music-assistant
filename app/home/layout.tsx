import React, { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
	return <div className='flex h-full w-full'>{children}</div>;
};

export default layout;
