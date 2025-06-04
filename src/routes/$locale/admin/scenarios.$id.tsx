import { ScenarioForm } from "@/components/forms/ScenarioForm";
import { Page, PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import {
	deleteScenarioFn,
	getScenarioFn,
	createOrUpdateScenarioFn,
} from "@/lib/handlers/scenarios";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Trash } from "lucide-react";

export const Route = createFileRoute("/$locale/admin/scenarios/$id")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const scenario = await getScenarioFn({
			data: { id },
		});
		if (!scenario) throw notFound();
		return scenario;
	},
});

function RouteComponent() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const { id, data } = Route.useLoaderData();

	const updateScenario = useMutation({
		mutationFn: createOrUpdateScenarioFn,
		onSuccess: () => {
			router.invalidate();
		},
	});

	const deleteScenario = useMutation({
		mutationFn: deleteScenarioFn,
		onSuccess: () => {
			navigate({
				to: "/$locale/admin",
			});
		},
	});

	return (
		<Page>
			<PageHeader title={data.name} description="Edit this scenario">
				<Button
					variant="secondary"
					onClick={() => {
						deleteScenario.mutate({
							data: {
								id,
							},
						});
					}}
				>
					<Trash />
					Delete
				</Button>
			</PageHeader>
			<ScenarioForm
				key={id}
				defaultValues={data}
				onSubmit={({ value }) =>
					updateScenario.mutateAsync({
						data: {
							...value,
							id,
						},
					})
				}
			/>
		</Page>
	);
}
