import { PageSubHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";
import { type ScenarioType, ScenarioSchema } from "@/lib/types/scenarios";
import { Plus, Trash } from "lucide-react";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "../ui/card";

export const ScenarioForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: ScenarioType;
	onSubmit: ({ value }: { value: ScenarioType }) => Promise<any>;
}) => {
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
		} as ScenarioType,
		validators: {
			onSubmit: ScenarioSchema,
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
				<PageSubHeader
					title="User"
					description="Describe the users role in the scenario"
				/>
				<form.AppField
					name="user.role"
					children={(field) => <field.TextAreaField label="Role" />}
				/>
				<form.AppField
					name="user.goals"
					children={(field) => <field.TextAreaField label="Goals" />}
				/>
				<form.AppField
					name="user.evaluations"
					mode="array"
					children={(field) => (
						<div className="flex flex-col gap-4">
							<PageSubHeader
								title="User Evaluations"
								description="Describe the evaluations that should be tracked for the user"
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
										});
									}}
								>
									<Plus />
									Add
								</Button>
							</PageSubHeader>
							{field.state?.value?.map((_, i) => (
								<Card key={i}>
									<CardHeader>
										<CardTitle>
											Evaluation {i + 1}
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
												Delete
											</Button>
										</CardAction>
									</CardHeader>
									<CardContent className="flex flex-col gap-4">
										<form.AppField
											name={`user.evaluations[${i}].name`}
											children={(subField) => (
												<div className="flex-1">
													<subField.TextField label="Name" />
												</div>
											)}
										/>
										<form.AppField
											name={`user.evaluations[${i}].description`}
											children={(subField) => (
												<subField.TextAreaField label="Description" />
											)}
										/>
										<form.AppField
											name={`user.evaluations[${i}].type`}
											children={(subField) => (
												<subField.SelectField
													label="Type"
													description="The type of evaluation. Message is a single message (ex. Politeness) and Session is evaluated on all of messages (ex. Conversation)"
													options={[
														{
															label: "Message",
															value: "message",
														},
														{
															label: "Session",
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
													label="Measure"
													description="How the evaluation is measured (ex. True/False, 0-100, 1-10)"
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
																label="Initial Value"
																description="The initial value of the evaluation (ex. 0, false)"
															/>
														)}
													/>
												)
											}
										</form.Subscribe>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				/>
				<PageSubHeader
					title="Persona"
					description="Describe the personas role in the scenario"
				/>
				<form.AppField
					name="persona.role"
					children={(field) => <field.TextAreaField label="Role" />}
				/>
				<form.AppField
					name="persona.goals"
					children={(field) => <field.TextAreaField label="Goals" />}
				/>
				<form.AppField
					name="persona.evaluations"
					mode="array"
					children={(field) => (
						<div className="flex flex-col gap-4">
							<PageSubHeader
								title="Persona Evaluations"
								description="Describe the evaluations that should be tracked for the persona"
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
										});
									}}
								>
									<Plus />
									Add
								</Button>
							</PageSubHeader>
							{field.state?.value?.map((_, i) => (
								<Card key={i}>
									<CardHeader>
										<CardTitle>Stat {i + 1}</CardTitle>
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
												Delete
											</Button>
										</CardAction>
									</CardHeader>
									<CardContent className="flex flex-col gap-4">
										<form.AppField
											name={`persona.evaluations[${i}].name`}
											children={(subField) => (
												<div className="flex-1">
													<subField.TextField label="Name" />
												</div>
											)}
										/>
										<form.AppField
											name={`persona.evaluations[${i}].description`}
											children={(subField) => (
												<subField.TextAreaField label="Description" />
											)}
										/>
										<form.AppField
											name={`persona.evaluations[${i}].type`}
											children={(subField) => (
												<subField.SelectField
													label="Type"
													description="The type of evaluation. Message is a single message (ex. Politeness) and Session is evaluated on all of messages (ex. Conversation)"
													options={[
														{
															label: "Message",
															value: "message",
														},
														{
															label: "Session",
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
													label="Measure"
													description="How the evaluation is measured (ex. True/False, 0-100, 1-10)"
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
																label="Initial Value"
																description="The initial value of the evaluation (ex. 0, false)"
															/>
														)}
													/>
												)
											}
										</form.Subscribe>
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
