import { ContextForm } from "@/components/forms/ContextForm";
import { Page, PageHeader } from "@/components/Page";
import { createOrUpdateContextFn } from "@/lib/handlers/contexts";
import { useLocale, useTranslations } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/contexts/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const locale = useLocale();
	const t = useTranslations("ContextCreate");
	const createContext = useMutation({
		mutationFn: createOrUpdateContextFn,
		onSuccess: ({ id }) => {
			toast.success(t.toast);
			navigate({
				to: "/$locale/admin/contexts/$id",
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
			<ContextForm
				onSubmit={({ value }) =>
					createContext.mutateAsync({
						data: value,
					})
				}
			/>
		</Page>
	);
}
