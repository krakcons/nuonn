import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, PageHeader, PageSubHeader } from "@/components/Page";
import { useTranslations } from "@/lib/locale";
import { getBehavioursFn } from "@/lib/handlers/behaviours";
import { getContextsFn } from "@/lib/handlers/contexts";
import { getModulesFn } from "@/lib/handlers/modules";
import { getPersonasFn } from "@/lib/handlers/personas";
import { getScenariosFn } from "@/lib/handlers/scenarios";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/$locale/admin/")({
	component: RouteComponent,
	loader: () =>
		Promise.all([
			getPersonasFn(),
			getBehavioursFn(),
			getScenariosFn(),
			getContextsFn(),
			getModulesFn(),
		]),
});

function RouteComponent() {
	const t = useTranslations("Dashboard");
	const tSidebar = useTranslations("AdminSidebar");
	const [personas, behaviours, scenarios, contexts, modules] =
		Route.useLoaderData();

	return (
		<Page>
			<PageHeader title={t.title} description={t.description} />
			<PageSubHeader
				title={tSidebar.modules.title}
				description={tSidebar.modules.tooltip}
			/>
			{modules.map((module) => (
				<Link
					key={module.id}
					to="/$locale/admin/modules/$id"
					from={Route.fullPath}
					params={{ id: module.id }}
				>
					<Card>
						<CardHeader>
							<CardTitle>{module.data.name}</CardTitle>
							<CardDescription>
								{module.data.description}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			))}
			<PageSubHeader
				className="mt-2"
				title={tSidebar.personas.title}
				description={tSidebar.personas.tooltip}
			/>
			{personas.map((persona) => (
				<Link
					key={persona.id}
					to="/$locale/admin/characters/$id"
					from={Route.fullPath}
					params={{ id: persona.id }}
				>
					<Card>
						<CardHeader>
							<CardTitle>{persona.data.name}</CardTitle>
							<CardDescription></CardDescription>
						</CardHeader>
					</Card>
				</Link>
			))}
			<PageSubHeader
				className="mt-2"
				title={tSidebar.behaviours.title}
				description={tSidebar.behaviours.tooltip}
			/>
			{behaviours.map((behaviour) => (
				<Link
					key={behaviour.id}
					to="/$locale/admin/behaviours/$id"
					from={Route.fullPath}
					params={{ id: behaviour.id }}
				>
					<Card>
						<CardHeader>
							<CardTitle>{behaviour.data.name}</CardTitle>
							<CardDescription>
								{behaviour.data.description}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			))}
			<PageSubHeader
				className="mt-2"
				title={tSidebar.scenarios.title}
				description={tSidebar.scenarios.tooltip}
			/>
			{scenarios.map((scenario) => (
				<Link
					key={scenario.id}
					to="/$locale/admin/scenarios/$id"
					from={Route.fullPath}
					params={{ id: scenario.id }}
				>
					<Card>
						<CardHeader>
							<CardTitle>{scenario.data.name}</CardTitle>
							<CardDescription>
								{scenario.data.description}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			))}
			<PageSubHeader
				className="mt-2"
				title={tSidebar.contexts.title}
				description={tSidebar.contexts.tooltip}
			/>
			{contexts.map((context) => (
				<Link
					key={context.id}
					to="/$locale/admin/contexts/$id"
					from={Route.fullPath}
					params={{ id: context.id }}
				>
					<Card>
						<CardHeader>
							<CardTitle>{context.data.name}</CardTitle>
							<CardDescription>
								{context.data.description}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			))}
		</Page>
	);
}
