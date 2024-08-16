import "@styles/globals.css";
// app/hop-layout.tsx
import ConditionalLayout from "@components/layout/ConditionalLayout";

export default function HopLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ConditionalLayout>{children}</ConditionalLayout>;
}
