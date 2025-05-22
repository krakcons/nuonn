import { ScenarioForm } from "@/components/forms/ScenarioForm";
import { Page, PageHeader } from "@/components/Page";
import { updateScenarioFn } from "@/lib/handlers/scenarios";
import { useLocale } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/admin/scenarios/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const locale = useLocale();
	const createScenarioFn = useMutation({
		mutationFn: updateScenarioFn,
		onSuccess: ({ id }) => {
			navigate({
				to: "/$locale/admin/scenarios/$id",
				params: {
					id,
					locale,
				},
			});
		},
	});

	return (
		<Page>
			<PageHeader
				title="Create Scenario"
				description="Create a new scenario for the user and the persona"
			/>
			<ScenarioForm
				onSubmit={({ value }) =>
					createScenarioFn.mutateAsync({
						data: value,
					})
				}
			/>
		</Page>
	);
}
