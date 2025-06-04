import { useAppForm } from "@/components/ui/form";
import {
	ApiKeyFormSchema,
	type ApiKeyFormType,
	type ApiKeyType,
} from "@/lib/handlers/apiKeys.types";

const apiKeyLocations: Record<ApiKeyType["provider"], string> = {
	openai: "https://platform.openai.com/settings/organization/api-keys",
};

export const ApiKeyForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: ApiKeyFormType;
	onSubmit: ({ value }: { value: ApiKeyFormType }) => Promise<any>;
}) => {
	const form = useAppForm({
		defaultValues: {
			key: "",
			provider: "openai",
			...defaultValues,
		} as ApiKeyFormType,
		validators: {
			onSubmit: ApiKeyFormSchema,
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
					name="key"
					children={(field) => <field.TextField label="Key" />}
				/>
				<form.AppField
					name="provider"
					children={(field) => (
						<field.SelectField
							label="Provider"
							options={[{ label: "OpenAI", value: "openai" }]}
							description={apiKeyLocations[field.state.value]}
						/>
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};
