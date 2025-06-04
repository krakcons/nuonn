import { useAppForm } from "@/components/ui/form";
import { ContextSchema, type ContextType } from "@/lib/types/contexts";

export const ContextForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: ContextType;
	onSubmit: ({ value }: { value: ContextType }) => Promise<any>;
}) => {
	const form = useAppForm({
		defaultValues,
		validators: {
			onSubmit: ContextSchema,
		},
		onSubmit,
	});

	return (
		<form.AppForm>
			<form
				onSubmit={(e) => e.preventDefault()}
				className="flex flex-col gap-4"
			>
				<form.AppField
					name="name"
					children={(field) => <field.TextField label="Name" />}
				/>
				<form.AppField
					name="description"
					children={(field) => (
						<field.TextAreaField label="Description" />
					)}
				/>
				<form.AppField
					name="user"
					children={(field) => (
						<field.TextAreaField label="User Context" />
					)}
				/>
				<form.AppField
					name="persona"
					children={(field) => (
						<field.TextAreaField label="Persona Context" />
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};
