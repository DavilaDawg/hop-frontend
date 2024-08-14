import "@styles/globals.css";
import LeftSidebar from "@components/layout/LeftSidebar";

export default function HopLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className= "flex h-screen">
			<LeftSidebar />
			<main className="flex-1 overflow-auto">{children}</main>
		</div>
	);
}
