import { ApiKeyForm } from "@/components/forms/ApiKeyForm";
import { Page, PageHeader } from "@/components/Page";
import { createOrUpdateApiKeyFn } from "@/lib/handlers/apiKeys";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/admin/api-keys/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();

	const createApiKey = useMutation({
		mutationFn: createOrUpdateApiKeyFn,
		onSuccess: () => {
			navigate({
				to: "/$locale/admin/api-keys",
			});
		},
	});

	return (
		<Page>
			<PageHeader
				title="Create API Key"
				description="Add a new AI API key to Nuonn for use within modules."
			/>
			<ApiKeyForm
				onSubmit={({ value }) =>
					createApiKey.mutateAsync({
						data: value,
					})
				}
			/>
		</Page>
	);
}
