import { useAppForm } from "@/components/ui/form";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Page } from "@/components/Page";
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
			scenarioId: scenarios.length ? scenarios[0].id : null,
			personaId: personas.length ? personas[0].id : null,
			behaviourId: behaviors.length ? behaviors[0].id : null,
			contextIds: [],
		} as ChatPlaygroundInputType,
	});

	return (
		<Page>
			<div className="flex flex-col items-center justify-end h-[calc(100svh-100px)] gap-4">
				<div className="max-w-2xl w-full flex flex-col">
					<form.Subscribe
						selector={(state) => state.values}
						children={(values) => (
							<Chat
								type="playground"
								additionalBody={{
									scenarioId: values.scenarioId,
									personaId: values.personaId,
									behaviourId: values.behaviourId,
									contextIds: values.contextIds,
								}}
								onStart={() => {
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
					<form.AppForm>
						<form
							onSubmit={(e) => e.preventDefault()}
							className="flex gap-2 p-4 overflow-x-auto"
						>
							<form.AppField
								name="scenarioId"
								children={(field) => (
									<field.SelectField
										disabled={disabled}
										label={t.scenario.title}
										placeholder={t.scenario.description}
										options={scenarios.map((s) => ({
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
										disabled={disabled}
										label={t.context.title}
										placeholder={t.context.description}
										value={field.state.value}
										options={contexts.map((c) => ({
											label: c.data.name,
											value: c.id,
										}))}
									/>
								)}
							/>
							<form.AppField
								name="personaId"
								children={(field) => (
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
								)}
							/>
							<form.AppField
								name="behaviourId"
								children={(field) => (
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
								)}
							/>
						</form>
					</form.AppForm>
				</div>
			</div>
		</Page>
	);
}
