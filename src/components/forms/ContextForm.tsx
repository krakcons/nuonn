import { useAppForm } from "@/components/ui/form";
import { ContextDataSchema, type ContextDataType } from "@/lib/types/contexts";

export const ContextForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: ContextDataType;
	onSubmit: ({ value }: { value: ContextDataType }) => Promise<any>;
}) => {
	const form = useAppForm({
		defaultValues,
		validators: {
			onSubmit: ContextDataSchema,
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
