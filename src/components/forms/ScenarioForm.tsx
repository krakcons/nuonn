import { PageSubHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";
import {
	type ScenarioDataType,
	ScenarioDataSchema,
} from "@/lib/types/scenarios";
import { Plus, Trash } from "lucide-react";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { useTranslations } from "@/lib/locale";

export const ScenarioForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: ScenarioDataType;
	onSubmit: ({ value }: { value: ScenarioDataType }) => Promise<any>;
}) => {
	const t = useTranslations("ScenarioForm");
	const tActions = useTranslations("Actions");
	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			user: {
				evaluations: [
					{
						name: "",
						description: "",
						measure: "",
						initialValue: "",
						type: "message",
					},
				],
			},
			persona: {
				evaluations: [
					{
						name: "",
						description: "",
						measure: "",
						initialValue: "",
						type: "session",
					},
				],
			},
			...defaultValues,
		} as ScenarioDataType,
		validators: {
			onSubmit: ScenarioDataSchema,
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
					name="instructions"
					children={(field) => (
						<field.TextAreaField
							optional
							label={t.instructions.label}
							description={t.instructions.description}
						/>
					)}
				/>
				<PageSubHeader
					title={t.user.title}
					description={t.user.description}
				/>
				<form.AppField
					name="user.role"
					children={(field) => <field.TextAreaField label={t.role} />}
				/>
				<form.AppField
					name="user.goals"
					children={(field) => (
						<field.TextAreaField label={t.goals} />
					)}
				/>
				<form.AppField
					name="user.evaluations"
					mode="array"
					children={(field) => (
						<div className="flex flex-col gap-4">
							<PageSubHeader
								title={t.userEvaluations.title}
								description={t.userEvaluations.description}
							>
								<Button
									onClick={(e) => {
										e.preventDefault();
										field.pushValue({
											name: "",
											description: "",
											type: "message",
											measure: "",
											initialValue: "",
											successValue: "",
										});
									}}
								>
									<Plus />
									{tActions.create}
								</Button>
							</PageSubHeader>
							{field.state?.value?.map((_, i) => (
								<Card key={i}>
									<CardHeader>
										<CardTitle>
											{t.evaluation} {i + 1}
										</CardTitle>
										<CardAction>
											<Button
												onClick={(e) => {
													e.preventDefault();
													field.removeValue(i);
												}}
												variant="secondary"
												size="sm"
											>
												<Trash />
												{tActions.delete}
											</Button>
										</CardAction>
									</CardHeader>
									<CardContent className="flex flex-col gap-4">
										<form.AppField
											name={`user.evaluations[${i}].name`}
											children={(subField) => (
												<div className="flex-1">
													<subField.TextField
														label={t.name}
													/>
												</div>
											)}
										/>
										<form.AppField
											name={`user.evaluations[${i}].description`}
											children={(subField) => (
												<subField.TextAreaField
													label={t.description}
												/>
											)}
										/>
										<form.AppField
											name={`user.evaluations[${i}].type`}
											children={(subField) => (
												<subField.SelectField
													label={
														t.evaluationType.title
													}
													description={
														t.evaluationType
															.description
													}
													options={[
														{
															label: t
																.evaluationType
																.message,
															value: "message",
														},
														{
															label: t
																.evaluationType
																.session,
															value: "session",
														},
													]}
												/>
											)}
										/>
										<form.AppField
											name={`user.evaluations[${i}].measure`}
											children={(subField) => (
												<subField.TextField
													label={
														t.evaluationMeasure
															.title
													}
													description={
														t.evaluationMeasure
															.description
													}
												/>
											)}
										/>
										<form.Subscribe
											selector={(formState) => [
												formState.values.user
													.evaluations[i].type,
											]}
										>
											{([type]) =>
												type === "session" && (
													<form.AppField
														name={`user.evaluations[${i}].initialValue`}
														children={(
															subField,
														) => (
															<subField.TextField
																label={
																	t
																		.initialValue
																		.title
																}
																description={
																	t
																		.initialValue
																		.description
																}
															/>
														)}
													/>
												)
											}
										</form.Subscribe>
										<form.AppField
											name={`user.evaluations[${i}].successValue`}
											children={(subField) => (
												<subField.TextField
													label={t.successValue.title}
													description={
														t.successValue
															.description
													}
												/>
											)}
										/>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				/>
				<PageSubHeader
					title={t.persona.title}
					description={t.persona.description}
				/>
				<form.AppField
					name="persona.role"
					children={(field) => <field.TextAreaField label={t.role} />}
				/>
				<form.AppField
					name="persona.goals"
					children={(field) => (
						<field.TextAreaField label={t.goals} />
					)}
				/>
				<form.AppField
					name="persona.evaluations"
					mode="array"
					children={(field) => (
						<div className="flex flex-col gap-4">
							<PageSubHeader
								title={t.personaEvaluations.title}
								description={t.personaEvaluations.description}
							>
								<Button
									onClick={(e) => {
										e.preventDefault();
										field.pushValue({
											name: "",
											description: "",
											measure: "",
											initialValue: "",
											type: "session",
											successValue: "",
										});
									}}
								>
									<Plus />
									{tActions.create}
								</Button>
							</PageSubHeader>
							{field.state?.value?.map((_, i) => (
								<Card key={i}>
									<CardHeader>
										<CardTitle>
											{t.evaluation} {i + 1}
										</CardTitle>
										<CardAction>
											<Button
												onClick={(e) => {
													e.preventDefault();
													field.removeValue(i);
												}}
												variant="secondary"
												size="sm"
											>
												<Trash />
												{tActions.delete}
											</Button>
										</CardAction>
									</CardHeader>
									<CardContent className="flex flex-col gap-4">
										<form.AppField
											name={`persona.evaluations[${i}].name`}
											children={(subField) => (
												<div className="flex-1">
													<subField.TextField
														label={t.name}
													/>
												</div>
											)}
										/>
										<form.AppField
											name={`persona.evaluations[${i}].description`}
											children={(subField) => (
												<subField.TextAreaField
													label={t.description}
												/>
											)}
										/>
										<form.AppField
											name={`persona.evaluations[${i}].type`}
											children={(subField) => (
												<subField.SelectField
													label={
														t.evaluationType.title
													}
													description={
														t.evaluationType
															.description
													}
													options={[
														{
															label: t
																.evaluationType
																.message,
															value: "message",
														},
														{
															label: t
																.evaluationType
																.session,
															value: "session",
														},
													]}
												/>
											)}
										/>
										<form.AppField
											name={`persona.evaluations[${i}].measure`}
											children={(subField) => (
												<subField.TextField
													label={
														t.evaluationMeasure
															.title
													}
													description={
														t.evaluationMeasure
															.description
													}
												/>
											)}
										/>
										<form.Subscribe
											selector={(formState) => [
												formState.values.persona
													.evaluations[i].type,
											]}
										>
											{([type]) =>
												type === "session" && (
													<form.AppField
														name={`persona.evaluations[${i}].initialValue`}
														children={(
															subField,
														) => (
															<subField.TextField
																label={
																	t
																		.initialValue
																		.title
																}
																description={
																	t
																		.initialValue
																		.description
																}
															/>
														)}
													/>
												)
											}
										</form.Subscribe>
										<form.AppField
											name={`persona.evaluations[${i}].successValue`}
											children={(subField) => (
												<subField.TextField
													label={t.successValue.title}
													description={
														t.successValue
															.description
													}
												/>
											)}
										/>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};
