import { useAppForm } from "@/components/ui/form";
import type { ContextType } from "@/lib/types/contexts";
import { ModuleDataSchema, type ModuleDataType } from "@/lib/types/modules";
import type { PersonaType } from "@/lib/types/personas";
import type { ScenarioType } from "@/lib/types/scenarios";
import { z } from "zod";
import type { ApiKeyType } from "@/lib/types/apiKeys";
import { useTranslations } from "@/lib/locale";
import { BehaviourType } from "@/lib/types/behaviours";
import { DollarSign } from "lucide-react";
import { prices } from "@/lib/prices";

export const ModuleForm = ({
	defaultValues,
	onSubmit,
	apiKeyOptions,
	scenarioOptions,
	personaOptions,
	contextOptions,
	behaviourOptions,
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
	behaviourOptions: BehaviourType[];
}) => {
	const t = useTranslations("ModuleForm");
	const form = useAppForm({
		defaultValues: {
			contextIds: [],
			personaIds: [],
			referrers: [],
			behaviourIds: [],
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
					children={(field) => <field.TextField label={t.name} />}
				/>
				<form.AppField
					name="description"
					children={(field) => (
						<field.TextAreaField optional label={t.description} />
					)}
				/>
				<form.AppField
					name="apiKeyId"
					children={(field) => (
						<field.SelectField
							placeholder={t.apiKey.placeholder}
							label={t.apiKey.label}
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
							placeholder={t.scenario.placeholder}
							label={t.scenario.label}
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
							placeholder={t.contexts.placeholder}
							label={t.contexts.label}
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
							placeholder={t.personas.placeholder}
							label={t.personas.label}
							options={personaOptions.map((p) => ({
								label: p.data.name,
								value: p.id,
							}))}
						/>
					)}
				/>
				<form.AppField
					name="behaviourIds"
					children={(field) => (
						<field.MultiSelectField
							placeholder={t.behaviours.placeholder}
							label={t.behaviours.label}
							options={behaviourOptions.map((b) => ({
								label: b.data.name,
								value: b.id,
							}))}
						/>
					)}
				/>
				<form.AppField
					name="costLimit"
					children={(field) => (
						<div className="relative flex items-center gap-4">
							<DollarSign className="absolute size-4 left-2 top-8" />
							<field.TextField
								className="pl-8"
								label={
									t.limit.label +
									(field.state.value
										? ` (Tokens: ${Math.round(Number(field.state.value) / prices["gpt-4o"])})`
										: "")
								}
								description={t.limit.placeholder}
								type="number"
								min={0}
								step={0.01}
							/>
						</div>
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};
