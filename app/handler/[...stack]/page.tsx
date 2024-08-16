import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function Handler(props: any) {
	return <StackHandler app={stackServerApp} {...props} />;
}
