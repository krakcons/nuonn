import {
	createDataTableActionsColumn,
	DataTable,
} from "@/components/DataTable";
import { Page, PageHeader } from "@/components/Page";
import { buttonVariants } from "@/components/ui/button";
import { deleteApiKeyFn, getApiKeysFn } from "@/lib/handlers/apiKeys";
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

	const deleteApiKey = useMutation({
		mutationFn: deleteApiKeyFn,
		onSuccess: () => {
			toast.success("API key deleted successfully");
			router.invalidate();
		},
	});

	return (
		<Page>
			<PageHeader title="API Keys" description="Manage your API keys.">
				<Link
					to="/$locale/admin/api-keys/create"
					from={Route.fullPath}
					className={buttonVariants()}
				>
					<Plus />
					Create
				</Link>
			</PageHeader>
			<DataTable
				data={apiKeys}
				from={Route.fullPath}
				columns={[
					{
						id: "name",
						accessorKey: "name",
						header: "Name",
					},
					{
						id: "key",
						header: "Key",
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
						header: "Provider",
						cell: ({ cell }) => cell.getValue(),
					},
					createDataTableActionsColumn<ApiKeyType>([
						{
							name: "Delete",
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
