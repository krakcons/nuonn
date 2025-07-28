import { useAppForm } from "@/components/ui/form";
import {
	type BehaviourDataType,
	BehaviourDataSchema,
} from "@/lib/types/behaviours";
import { useTranslations } from "@/lib/locale";

export const BehaviourForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: BehaviourDataType;
	onSubmit: ({ value }: { value: BehaviourDataType }) => Promise<any>;
}) => {
	const t = useTranslations("BehaviourForm");
	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			rapportBuilding: 50,
			rapportLoss: 50,
			dishonesty: 50,
			...defaultValues,
		} as BehaviourDataType,
		validators: {
			onSubmit: BehaviourDataSchema,
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
					name="rapportBuilding"
					children={(field) => (
						<field.SliderField
							label={t.rapportBuilding}
							min={1}
							max={100}
						/>
					)}
				/>
				<form.AppField
					name="rapportLoss"
					children={(field) => (
						<field.SliderField
							label={t.rapportLoss}
							min={1}
							max={100}
						/>
					)}
				/>
				<form.AppField
					name="dishonesty"
					children={(field) => (
						<field.SliderField
							label={t.dishonesty}
							min={1}
							max={100}
						/>
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};
