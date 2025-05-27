import { FloatingPage, PageHeader } from "@/components/Page";
import { buttonVariants } from "@/components/ui/button";
import { useTranslations } from "@/lib/locale";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/")({
	component: RouteComponent,
});

function RouteComponent() {
	const t = useTranslations("Home");
	return (
		<FloatingPage>
			<img src="/logo.svg" alt="Nuonn Logo" className="size-32 mb-8" />
			<PageHeader title={t.title} description={t.description} />
			<Link
				to="/$locale/admin"
				from={Route.fullPath}
				className={buttonVariants()}
			>
				{t.getStarted}
			</Link>
		</FloatingPage>
	);
}
