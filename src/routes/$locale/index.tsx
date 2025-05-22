import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$locale/"!</div>;
}
