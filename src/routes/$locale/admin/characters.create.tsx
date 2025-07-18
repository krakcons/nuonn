import { PersonaForm } from "@/components/forms/PersonaForm";
import { Page, PageHeader } from "@/components/Page";
import { createOrUpdatePersonaFn } from "@/lib/handlers/personas";
import { useLocale, useTranslations } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/characters/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const locale = useLocale();
	const t = useTranslations("PersonaCreate");
	const createPersonaFn = useMutation({
		mutationFn: createOrUpdatePersonaFn,
		onSuccess: ({ id }) => {
			toast.success(t.toast);
			navigate({
				to: "/$locale/admin/characters/$id",
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
			<PersonaForm
				onSubmit={({ value }) =>
					createPersonaFn.mutateAsync({
						data: value,
					})
				}
			/>
		</Page>
	);
}
