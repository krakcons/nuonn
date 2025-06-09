import {
	createDataTableActionsColumn,
	DataTable,
} from "@/components/DataTable";
import { Page, PageHeader } from "@/components/Page";
import { buttonVariants } from "@/components/ui/button";
import { deleteApiKeyFn, getApiKeysFn } from "@/lib/handlers/apiKeys";
import { useTranslations } from "@/lib/locale";
import type { ApiKeyType } from "@/lib/types/apiKeys";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/api-keys/")({
	component: RouteComponent,
	loader: async () => {
		const apiKeys = await getApiKeysFn();
		return apiKeys;
	},
});

function RouteComponent() {
	const apiKeys = Route.useLoaderData();
	const router = useRouter();
	const t = useTranslations("ApiKey");
	const tActions = useTranslations("Actions");

	const deleteApiKey = useMutation({
		mutationFn: deleteApiKeyFn,
		onSuccess: () => {
			toast.success(t.deleteToast);
			router.invalidate();
		},
	});

	return (
		<Page>
			<PageHeader title={t.title} description={t.description}>
				<Link
					to="/$locale/admin/api-keys/create"
					from={Route.fullPath}
					className={buttonVariants()}
				>
					<Plus />
					{tActions.create}
				</Link>
			</PageHeader>
			<DataTable
				data={apiKeys}
				from={Route.fullPath}
				columns={[
					{
						id: "name",
						accessorKey: "name",
						header: t.table.name,
					},
					{
						id: "key",
						header: t.table.key,
						cell: ({ cell }) => (
							<code>
								{cell.row.original.key.substring(0, 12) +
									"..." +
									cell.row.original.key.substring(
										cell.row.original.key.length - 12,
									)}
							</code>
						),
					},
					{
						id: "provider",
						accessorKey: "provider",
						header: t.table.provider,
						cell: ({ cell }) => cell.getValue(),
					},
					createDataTableActionsColumn<ApiKeyType>([
						{
							name: tActions.delete,
							onClick: (apiKey) => {
								deleteApiKey.mutate({
									data: {
										id: apiKey.id,
									},
								});
							},
						},
					]),
				]}
			/>
		</Page>
	);
}
