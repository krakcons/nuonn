import { ModuleForm } from "@/components/forms/ModuleForm";
import { Page, PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { getApiKeysFn } from "@/lib/handlers/apiKeys";
import { getContextsFn } from "@/lib/handlers/contexts";
import {
	createOrUpdateModuleFn,
	deleteModuleFn,
	getModuleFn,
} from "@/lib/handlers/modules";
import { getPersonasFn } from "@/lib/handlers/personas";
import { getScenariosFn } from "@/lib/handlers/scenarios";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/modules/$id")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const module = await getModuleFn({
			data: { id },
		});
		if (!module) throw notFound();
		return Promise.all([
			module,
			getScenariosFn(),
			getContextsFn(),
			getPersonasFn(),
			getApiKeysFn(),
		]);
	},
});

function RouteComponent() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const [module, scenarios, contexts, personas, apiKeys] =
		Route.useLoaderData();
	const { id, data } = module;

	const updateModule = useMutation({
		mutationFn: createOrUpdateModuleFn,
		onSuccess: () => {
			toast.success("Module updated successfully");
			router.invalidate();
		},
	});

	const deleteModule = useMutation({
		mutationFn: deleteModuleFn,
		onSuccess: () => {
			toast.success("Module deleted successfully");
			navigate({
				to: "/$locale/admin",
			});
		},
	});

	return (
		<Page>
			<PageHeader title={data.name} description="Edit this module">
				<Button
					variant="secondary"
					onClick={() => {
						deleteModule.mutate({
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
			<ModuleForm
				key={id}
				defaultValues={{
					...data,
					apiKeyId: module.apiKeyId,
				}}
				onSubmit={({ value }) =>
					updateModule.mutateAsync({
						data: {
							...value,
							id,
						},
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
