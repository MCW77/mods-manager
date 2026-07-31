import type React from "react";

interface BaseErrorOptions extends ErrorOptions {
	cause?: unknown;
	error: React.ReactNode;
	reason?: React.ReactNode;
	solution?: React.ReactNode;
}
class BaseError extends Error {
	error: React.ReactNode;
	reason: React.ReactNode;
	solution: React.ReactNode;
	constructor(message: string, options?: BaseErrorOptions) {
		super(message, options);
		this.name = "BaseError";
		this.error = options?.error || message;
		this.reason = options?.reason || "";
		this.solution = options?.solution || "";
	}
}

export { BaseError };
