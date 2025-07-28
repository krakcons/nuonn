import { BehaviourForm } from "@/components/forms/BehaviourForm";
import { Page, PageHeader } from "@/components/Page";
import { createOrUpdateBehaviourFn } from "@/lib/handlers/behaviours";
import { useLocale, useTranslations } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/behaviours/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const locale = useLocale();
	const t = useTranslations("BehaviourCreate");
	const createPersonaFn = useMutation({
		mutationFn: createOrUpdateBehaviourFn,
		onSuccess: ({ id }) => {
			toast.success(t.toast);
			navigate({
				to: "/$locale/admin/behaviours/$id",
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
			<BehaviourForm
				onSubmit={({ value }) =>
					createPersonaFn.mutateAsync({
						data: value,
					})
				}
			/>
		</Page>
	);
}
