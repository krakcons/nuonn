import { useAppForm } from "@/components/ui/form";
import { useTranslations } from "@/lib/locale";
import { ContextDataSchema, type ContextDataType } from "@/lib/types/contexts";

export const ContextForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: ContextDataType;
	onSubmit: ({ value }: { value: ContextDataType }) => Promise<any>;
}) => {
	const t = useTranslations("ContextForm");
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
					children={(field) => <field.TextField label={t.name} />}
				/>
				<form.AppField
					name="description"
					children={(field) => (
						<field.TextAreaField label={t.description} />
					)}
				/>
				<form.AppField
					name="user"
					children={(field) => <field.TextAreaField label={t.user} />}
				/>
				<form.AppField
					name="persona"
					children={(field) => (
						<field.TextAreaField label={t.persona} />
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};
