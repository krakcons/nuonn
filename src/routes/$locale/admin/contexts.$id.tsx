import { ContextForm } from "@/components/forms/ContextForm";
import { Page, PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import {
	createOrUpdateContextFn,
	deleteContextFn,
	getContextFn,
} from "@/lib/handlers/contexts";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Trash } from "lucide-react";

export const Route = createFileRoute("/$locale/admin/contexts/$id")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const context = await getContextFn({
			data: { id },
		});
		if (!context) throw notFound();
		return context;
	},
});

function RouteComponent() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const { id, data } = Route.useLoaderData();

	const updateContext = useMutation({
		mutationFn: createOrUpdateContextFn,
		onSuccess: () => {
			router.invalidate();
		},
	});

	const deleteContext = useMutation({
		mutationFn: deleteContextFn,
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
						deleteContext.mutate({
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
			<ContextForm
				key={id}
				defaultValues={data}
				onSubmit={({ value }) =>
					updateContext.mutateAsync({
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
