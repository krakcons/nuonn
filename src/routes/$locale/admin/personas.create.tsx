import { PersonaForm } from "@/components/forms/PersonaForm";
import { Page, PageHeader } from "@/components/Page";
import { updatePersonaFn } from "@/lib/handlers/personas";
import { useLocale } from "@/lib/locale";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/admin/personas/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const locale = useLocale();
	const createPersonaFn = useMutation({
		mutationFn: updatePersonaFn,
		onSuccess: ({ id }) => {
			navigate({
				to: "/$locale/admin/personas/$id",
				params: {
					id,
					locale,
				},
			});
		},
	});

	return (
		<Page>
			<PageHeader
				title="Create Persona"
				description="Create a new persona that can be used in a scenario"
			/>
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
