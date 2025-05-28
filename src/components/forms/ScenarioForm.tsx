import { PageSubHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";
import { type ScenarioType, ScenarioSchema } from "@/lib/ai";
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
			user: {
				evaluations: [
					{
						name: undefined,
						type: "message",
						description: undefined,
						value: undefined,
					},
				],
			},
			persona: {
				stats: [
					{
						name: undefined,
						description: undefined,
						value: undefined,
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
					name="user.context"
					children={(field) => (
						<field.TextAreaField label="Context" />
					)}
				/>
				<form.AppField
					name="user.evaluations"
					mode="array"
					children={(field) => (
						<div className="flex flex-col gap-4">
							<PageSubHeader
								title="Evaluations"
								description="Describe how the user should be evaluated"
							>
								<Button
									onClick={(e) => {
										e.preventDefault();
										field.pushValue({
											name: "",
											type: "message",
											description: "",
											value: "",
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
										<div className="flex gap-4">
											<form.AppField
												name={`user.evaluations[${i}].name`}
												children={(subField) => (
													<div className="flex-1">
														<subField.TextField label="Name" />
													</div>
												)}
											/>
											<form.AppField
												name={`user.evaluations[${i}].value`}
												children={(subField) => (
													<subField.TextField label="Initial Value" />
												)}
											/>
											<form.AppField
												name={`user.evaluations[${i}].type`}
												children={(subField) => (
													<subField.SelectField
														label="Type"
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
										</div>
										<form.AppField
											name={`user.evaluations[${i}].description`}
											children={(subField) => (
												<subField.TextAreaField label="Description" />
											)}
										/>
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
					name="persona.context"
					children={(field) => (
						<field.TextAreaField label="Context" />
					)}
				/>
				<form.AppField
					name="persona.goals"
					children={(field) => <field.TextAreaField label="Goals" />}
				/>
				<form.AppField
					name="persona.stats"
					mode="array"
					children={(field) => (
						<div className="flex flex-col gap-4">
							<PageSubHeader
								title="Stats"
								description="Describe the stats that should be tracked for the persona"
							>
								<Button
									onClick={(e) => {
										e.preventDefault();
										field.pushValue({
											name: "",
											description: "",
											value: "",
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
										<div className="flex gap-4">
											<form.AppField
												name={`persona.stats[${i}].name`}
												children={(subField) => (
													<div className="flex-1">
														<subField.TextField label="Name" />
													</div>
												)}
											/>
											<form.AppField
												name={`persona.stats[${i}].value`}
												children={(subField) => (
													<subField.TextField label="Initial Value" />
												)}
											/>
										</div>
										<form.AppField
											name={`persona.stats[${i}].description`}
											children={(subField) => (
												<subField.TextAreaField label="Description" />
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
