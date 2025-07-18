import { useAppForm } from "@/components/ui/form";
import { useTranslations } from "@/lib/locale";
import {
	ContextDataSchema,
	contextTypes,
	type ContextDataType,
} from "@/lib/types/contexts";

export const ContextForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: ContextDataType;
	onSubmit: ({ value }: { value: ContextDataType }) => Promise<any>;
}) => {
	const t = useTranslations("ContextForm");
	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			type: "character",
			...defaultValues,
		} as ContextDataType,
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
					name="type"
					children={(field) => (
						<field.SelectField
							label={t.type.title}
							options={contextTypes.map((type) => ({
								value: type,
								label: t.type[type],
							}))}
						/>
					)}
				/>
				<form.AppField
					name="description"
					children={(field) => (
						<field.TextAreaField label={t.description} />
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};
