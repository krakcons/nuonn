import { ApiKeyForm } from "@/components/forms/ApiKeyForm";
import { Page, PageHeader } from "@/components/Page";
import { createOrUpdateApiKeyFn } from "@/lib/handlers/apiKeys";
import { useTranslations } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/api-keys/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const t = useTranslations("ApiKeyCreate");
	const createApiKey = useMutation({
		mutationFn: createOrUpdateApiKeyFn,
		onSuccess: () => {
			toast.success(t.toast);
			navigate({
				to: "/$locale/admin/api-keys",
			});
		},
	});

	return (
		<Page>
			<PageHeader title={t.title} description={t.description} />
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
