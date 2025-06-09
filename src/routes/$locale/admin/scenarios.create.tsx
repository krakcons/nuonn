import { ScenarioForm } from "@/components/forms/ScenarioForm";
import { Page, PageHeader } from "@/components/Page";
import { createOrUpdateScenarioFn } from "@/lib/handlers/scenarios";
import { useLocale, useTranslations } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/scenarios/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const locale = useLocale();
	const t = useTranslations("ScenarioCreate");
	const createScenarioFn = useMutation({
		mutationFn: createOrUpdateScenarioFn,
		onSuccess: ({ id }) => {
			toast.success(t.toast);
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
			<PageHeader title={t.title} description={t.description} />
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
