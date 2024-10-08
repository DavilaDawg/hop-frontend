import "@styles/globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import ConditionalLayout from "@components/layout/ConditionalLayout";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="m-0">
				<StackProvider app={stackServerApp}>
					<StackTheme>{children}</StackTheme>
				</StackProvider>
			</body>
		</html>
	);
}
