import { useAppForm } from "@/components/ui/form";
import type { ContextType } from "@/lib/types/contexts";
import { ModuleDataSchema, type ModuleDataType } from "@/lib/types/modules";
import type { PersonaType } from "@/lib/types/personas";
import type { ScenarioType } from "@/lib/types/scenarios";
import { z } from "zod";
import type { ApiKeyType } from "@/lib/types/apiKeys";

export const ModuleForm = ({
	defaultValues,
	onSubmit,
	apiKeyOptions,
	scenarioOptions,
	personaOptions,
	contextOptions,
}: {
	defaultValues?: ModuleDataType & { apiKeyId: string };
	onSubmit: ({
		value,
	}: {
		value: ModuleDataType & { apiKeyId: string };
	}) => Promise<any>;
	apiKeyOptions: ApiKeyType[];
	scenarioOptions: ScenarioType[];
	personaOptions: PersonaType[];
	contextOptions: ContextType[];
}) => {
	const form = useAppForm({
		defaultValues: {
			contextIds: [],
			personaIds: [],
			referrers: [],
			...defaultValues,
		} as ModuleDataType & { apiKeyId: string },
		validators: {
			onSubmit: ModuleDataSchema.extend({
				apiKeyId: z.string(),
			}),
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
						<field.TextAreaField optional label="Description" />
					)}
				/>
				<form.AppField
					name="apiKeyId"
					children={(field) => (
						<field.SelectField
							placeholder="Select an API Key"
							label="API Key"
							options={apiKeyOptions.map((k) => ({
								label: k.name,
								value: k.id,
							}))}
						/>
					)}
				/>
				<form.AppField
					name="scenarioId"
					children={(field) => (
						<field.SelectField
							placeholder="Select a Scenario"
							label="Scenario"
							options={scenarioOptions.map((s) => ({
								label: s.data.name,
								value: s.id,
							}))}
						/>
					)}
				/>
				<form.AppField
					name="contextIds"
					children={(field) => (
						<field.MultiSelectField
							optional
							placeholder="Select the contexts"
							label="Contexts"
							value={contextOptions
								.map((p) => ({
									label: p.data.name,
									value: p.id,
								}))
								.filter(({ value }) =>
									field.state.value.includes(value),
								)}
							options={contextOptions.map((c) => ({
								label: c.data.name,
								value: c.id,
							}))}
						/>
					)}
				/>
				<form.AppField
					name="personaIds"
					children={(field) => (
						<field.MultiSelectField
							placeholder="Select the personas"
							label="Personas"
							value={personaOptions
								.map((p) => ({
									label: p.data.name,
									value: p.id,
								}))
								.filter(({ value }) =>
									field.state.value.includes(value),
								)}
							options={personaOptions.map((p) => ({
								label: p.data.name,
								value: p.id,
							}))}
						/>
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};
