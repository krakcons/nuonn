import { ModuleForm } from "@/components/forms/ModuleForm";
import { Page, PageHeader } from "@/components/Page";
import { getApiKeysFn } from "@/lib/handlers/apiKeys";
import { getContextsFn } from "@/lib/handlers/contexts";
import { createOrUpdateModuleFn } from "@/lib/handlers/modules";
import { getPersonasFn } from "@/lib/handlers/personas";
import { getScenariosFn } from "@/lib/handlers/scenarios";
import { useLocale } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/modules/create")({
	component: RouteComponent,
	loader: () => {
		return Promise.all([
			getScenariosFn(),
			getContextsFn(),
			getPersonasFn(),
			getApiKeysFn(),
		]);
	},
});

function RouteComponent() {
	const navigate = useNavigate();
	const [scenarios, contexts, personas, apiKeys] = Route.useLoaderData();
	const locale = useLocale();
	const createModule = useMutation({
		mutationFn: createOrUpdateModuleFn,
		onSuccess: ({ id }) => {
			toast.success("Module created successfully");
			navigate({
				to: "/$locale/admin/modules/$id",
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
				title="Create Module"
				description="A module is a defined experience that can be used as a course"
			/>
			<ModuleForm
				onSubmit={({ value }) =>
					createModule.mutateAsync({
						data: value,
					})
				}
				scenarioOptions={scenarios}
				personaOptions={personas}
				contextOptions={contexts}
				apiKeyOptions={apiKeys}
			/>
		</Page>
	);
}
