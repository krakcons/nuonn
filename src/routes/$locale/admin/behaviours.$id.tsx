import { BehaviourForm } from "@/components/forms/BehaviourForm";
import { Page, PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import {
	deleteBehaviourFn,
	getBehaviourFn,
	createOrUpdateBehaviourFn,
} from "@/lib/handlers/behaviours";
import { useTranslations } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/behaviours/$id")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const persona = await getBehaviourFn({
			data: { id },
		});
		if (!persona) throw notFound();
		return persona;
	},
});

function RouteComponent() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const { id, data } = Route.useLoaderData();
	const t = useTranslations("Behaviour");
	const tActions = useTranslations("Actions");

	const updateBehaviour = useMutation({
		mutationFn: createOrUpdateBehaviourFn,
		onSuccess: () => {
			toast.success(t.toast);
			router.invalidate();
		},
	});

	const deleteBehaviour = useMutation({
		mutationFn: deleteBehaviourFn,
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
						deleteBehaviour.mutate({
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
			<BehaviourForm
				key={id}
				defaultValues={data}
				onSubmit={({ value }) =>
					updateBehaviour.mutateAsync({
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
