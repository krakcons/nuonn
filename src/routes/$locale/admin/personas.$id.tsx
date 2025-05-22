import { PersonaForm } from "@/components/forms/PersonaForm";
import { Page, PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import {
	deletePersonaFn,
	getPersonaFn,
	updatePersonaFn,
} from "@/lib/handlers/personas";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Trash } from "lucide-react";

export const Route = createFileRoute("/$locale/admin/personas/$id")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const persona = await getPersonaFn({
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

	const updatePersona = useMutation({
		mutationFn: updatePersonaFn,
		onSuccess: () => {
			router.invalidate();
		},
	});

	const deletePersona = useMutation({
		mutationFn: deletePersonaFn,
		onSuccess: () => {
			navigate({
				to: "/$locale/admin",
			});
		},
	});

	return (
		<Page>
			<PageHeader title={data.name} description="Edit this persona">
				<Button
					variant="secondary"
					onClick={() => {
						deletePersona.mutate({
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
			<PersonaForm
				key={id}
				defaultValues={data}
				onSubmit={({ value }) =>
					updatePersona.mutateAsync({
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
