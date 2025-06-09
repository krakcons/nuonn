import { ScenarioForm } from "@/components/forms/ScenarioForm";
import { Page, PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import {
	deleteScenarioFn,
	getScenarioFn,
	createOrUpdateScenarioFn,
} from "@/lib/handlers/scenarios";
import { useTranslations } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { toast } from "sonner";

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
	const t = useTranslations("Scenario");
	const tActions = useTranslations("Actions");

	const updateScenario = useMutation({
		mutationFn: createOrUpdateScenarioFn,
		onSuccess: () => {
			toast.success(t.toast);
			router.invalidate();
		},
	});

	const deleteScenario = useMutation({
		mutationFn: deleteScenarioFn,
		onSuccess: () => {
			toast.success(t.deleteToast);
			navigate({
				to: "/$locale/admin",
			});
		},
	});

	return (
		<Page>
			<PageHeader title={data.name} description={t.edit}>
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
					{tActions.delete}
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
