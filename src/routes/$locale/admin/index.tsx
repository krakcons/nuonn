import { useAppForm } from "@/components/ui/form";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Page, PageHeader } from "@/components/Page";
import {
	ChatPlaygroundInputSchema,
	type ChatPlaygroundInputType,
} from "@/lib/ai";
import { getPersonasFn } from "@/lib/handlers/personas";
import { getScenariosFn } from "@/lib/handlers/scenarios";
import { useState } from "react";
import { getContextsFn } from "@/lib/handlers/contexts";
import { useTranslations } from "@/lib/locale";
import { Chat } from "@/components/Chat";
import { getBehavioursFn } from "@/lib/handlers/behaviours";

export const Route = createFileRoute("/$locale/admin/")({
	component: RouteComponent,
	validateSearch: z.object({
		options: ChatPlaygroundInputSchema.optional(),
	}),
	loader: async () => {
		return Promise.all([
			getPersonasFn(),
			getScenariosFn(),
			getContextsFn(),
			getBehavioursFn(),
		]);
	},
});

function RouteComponent() {
	const [personas, scenarios, contexts, behaviors] = Route.useLoaderData();
	const [disabled, setDisabled] = useState(false);
	const t = useTranslations("Chat");
	const [complete, setComplete] = useState(false);

	const form = useAppForm({
		defaultValues: {
			scenarioId: scenarios.length ? scenarios[0].id : undefined,
			personaId: personas.length ? personas[0].id : undefined,
			behaviourId: behaviors.length ? behaviors[0].id : undefined,
			contextIds: [],
		} as ChatPlaygroundInputType,
		validators: {
			onMount: ChatPlaygroundInputSchema,
			onSubmit: ChatPlaygroundInputSchema,
		},
	});

	return (
		<Page className="h-full justify-between">
			<PageHeader title={t.title} description={t.description}>
				<form.AppForm>
					<form
						onSubmit={(e) => e.preventDefault()}
						className="flex gap-2 pt-4 overflow-x-auto min-h-24 w-full"
					>
						<form.AppField
							name="scenarioId"
							children={(field) => (
								<div className="flex-1">
									<field.SelectField
										disabled={disabled}
										label={t.scenario.title}
										placeholder={t.scenario.description}
										options={scenarios.map((s) => ({
											label: s.data.name,
											value: s.id,
										}))}
									/>
								</div>
							)}
						/>
						<form.AppField
							name="contextIds"
							children={(field) => (
								<div className="flex-1">
									<field.MultiSelectField
										disabled={disabled}
										label={t.context.title}
										placeholder={t.context.description}
										value={field.state.value}
										options={contexts.map((c) => ({
											label: c.data.name,
											value: c.id,
										}))}
									/>
								</div>
							)}
						/>
						<form.AppField
							name="personaId"
							children={(field) => (
								<div className="flex-1">
									<field.SelectField
										disabled={disabled}
										label={t.persona.title}
										placeholder={t.persona.description}
										options={[
											...personas.map((p) => ({
												label: p.data.name,
												value: p.id,
											})),
										]}
									/>
								</div>
							)}
						/>
						<form.AppField
							name="behaviourId"
							children={(field) => (
								<div className="flex-1">
									<field.SelectField
										disabled={disabled}
										label={t.behaviour.title}
										placeholder={t.behaviour.description}
										options={[
											...behaviors.map((b) => ({
												label: b.data.name,
												value: b.id,
											})),
										]}
									/>
								</div>
							)}
						/>
					</form>
				</form.AppForm>
			</PageHeader>
			<div className="max-h-[calc(100svh-340px)]">
				<form.Subscribe
					selector={(state) => ({
						values: state.values,
						isValid: state.isValid,
					})}
					children={({ values, isValid }) => (
						<Chat
							disabled={!isValid}
							type="playground"
							additionalBody={{
								scenarioId: values.scenarioId,
								personaId: values.personaId,
								behaviourId: values.behaviourId,
								contextIds: values.contextIds,
							}}
							onStart={() => {
								form.handleSubmit();
								setDisabled(true);
							}}
							complete={complete}
							onComplete={() => setComplete(true)}
							instructions={
								scenarios.find(
									(s) => s.id === values.scenarioId,
								)?.data.instructions
							}
						/>
					)}
				/>
			</div>
		</Page>
	);
}
