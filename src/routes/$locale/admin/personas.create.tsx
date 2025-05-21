import { Page, PageHeader, PageSubHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";
import { PersonaSchema, type PersonaType } from "@/lib/ai";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/$locale/admin/personas/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useAppForm({
		defaultValues: {
			name: "",
			intelligence: "medium",
			memory: "medium",
			wealth: "medium",
			health: "medium",
			mentalHealth: "medium",
			languages: [
				{
					name: "English",
					spoken: "medium",
					written: "medium",
				},
			],
		} as PersonaType,
		validators: {
			onSubmit: PersonaSchema,
		},
		onSubmit: (value) => {
			console.log("Submitted", value);
		},
	});

	const statOptions = [
		{
			label: "Low",
			value: "low",
		},
		{
			label: "Medium",
			value: "medium",
		},
		{
			label: "High",
			value: "high",
		},
	];

	return (
		<Page>
			<PageHeader
				title="Create Persona"
				description="Create a new persona that can be used in a scenario"
			/>
			<form.AppForm>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="flex flex-col gap-4"
				>
					<form.AppField
						name="name"
						children={(field) => <field.TextField label="Name" />}
					/>
					<form.AppField
						name="age"
						children={(field) => (
							<field.TextField
								type="number"
								label="Age"
								optional
							/>
						)}
					/>
					<form.AppField
						name="gender"
						children={(field) => (
							<field.TextField label="Gender" optional />
						)}
					/>
					<form.AppField
						name="sexuality"
						children={(field) => (
							<field.TextField label="Sexuality" optional />
						)}
					/>
					<form.AppField
						name="pronouns"
						children={(field) => (
							<field.TextField label="Pronouns" optional />
						)}
					/>
					<form.AppField
						name="ethnicity"
						children={(field) => (
							<field.TextField label="Ethinicity" optional />
						)}
					/>
					<form.AppField
						name="country"
						children={(field) => (
							<field.TextField label="Country" optional />
						)}
					/>
					<form.AppField
						name="education"
						children={(field) => (
							<field.TextField label="Education" optional />
						)}
					/>
					<form.AppField
						name="location"
						children={(field) => (
							<field.TextField label="Location" optional />
						)}
					/>
					<form.AppField
						name="height"
						children={(field) => (
							<field.TextField label="Height" optional />
						)}
					/>
					<form.AppField
						name="build"
						children={(field) => (
							<field.TextField label="Build" optional />
						)}
					/>
					<form.AppField
						name="transportation"
						children={(field) => (
							<field.TextField label="Transportation" optional />
						)}
					/>
					<form.AppField
						name="disibility"
						children={(field) => (
							<field.TextField label="Disibility(s)" optional />
						)}
					/>
					<form.AppField
						name="occupation"
						children={(field) => (
							<field.TextField label="Occupation" optional />
						)}
					/>
					<form.AppField
						name="relationships"
						children={(field) => (
							<field.TextField label="Relationships" optional />
						)}
					/>
					<form.AppField
						name="appearance"
						children={(field) => (
							<field.TextField label="Appearance" optional />
						)}
					/>
					<form.AppField
						name="religion"
						children={(field) => (
							<field.TextField label="Religion" optional />
						)}
					/>
					<form.AppField
						name="politics"
						children={(field) => (
							<field.TextField label="Politics" optional />
						)}
					/>
					<PageSubHeader title="Stats" />
					<div className="flex gap-2">
						<form.AppField
							name="intelligence"
							children={(field) => (
								<field.SelectField
									label="Intelligence"
									options={statOptions}
								/>
							)}
						/>
						<form.AppField
							name="memory"
							children={(field) => (
								<field.SelectField
									label="Memory"
									options={statOptions}
								/>
							)}
						/>
						<form.AppField
							name="wealth"
							children={(field) => (
								<field.SelectField
									label="Wealth"
									options={statOptions}
								/>
							)}
						/>
						<form.AppField
							name="health"
							children={(field) => (
								<field.SelectField
									label="Health"
									options={statOptions}
								/>
							)}
						/>
						<form.AppField
							name="mentalHealth"
							children={(field) => (
								<field.SelectField
									label="Mental Health"
									options={statOptions}
								/>
							)}
						/>
					</div>
					<PageSubHeader title="Personality" />
					<form.AppField
						name="traits"
						children={(field) => (
							<field.TextField label="Traits" optional />
						)}
					/>
					<form.AppField
						name="hobbies"
						children={(field) => (
							<field.TextField label="Hobbies" optional />
						)}
					/>
					<form.AppField
						name="likes"
						children={(field) => (
							<field.TextField label="Likes" optional />
						)}
					/>
					<form.AppField
						name="dislikes"
						children={(field) => (
							<field.TextField label="Dislikes" optional />
						)}
					/>
					<form.AppField
						name="backstory"
						children={(field) => (
							<field.TextField label="Backstory" optional />
						)}
					/>
					<form.AppField
						name="behaviour"
						children={(field) => (
							<field.TextField label="Behaviour" optional />
						)}
					/>
					<PageSubHeader
						title="Languages"
						description="Describe the languages the persona can speak"
					>
						<Button
							onClick={(e) => {
								e.preventDefault();
								field.pushValue({
									name: "",
									spoken: "medium",
									written: "medium",
								});
							}}
						>
							Add
						</Button>
					</PageSubHeader>
					<form.AppField
						name="languages"
						mode="array"
						children={(field) => (
							<div className="flex flex-col gap-4">
								{field.state?.value?.map((_, i) => (
									<div
										key={i}
										className="flex gap-4 border p-4 rounded items-end"
									>
										<form.AppField
											name={`languages[${i}].name`}
											children={(subField) => (
												<div className="flex-1">
													<subField.TextField label="Name" />
												</div>
											)}
										/>
										<form.AppField
											name={`languages[${i}].spoken`}
											children={(subField) => (
												<subField.SelectField
													label="Spoken"
													options={statOptions}
												/>
											)}
										/>
										<form.AppField
											name={`languages[${i}].written`}
											children={(subField) => (
												<subField.SelectField
													label="Written"
													options={statOptions}
												/>
											)}
										/>
										<Button
											onClick={(e) => {
												e.preventDefault();
												field.removeValue(i);
											}}
											variant="secondary"
										>
											Remove
										</Button>
									</div>
								))}
							</div>
						)}
					/>
					<form.SubmitButton />
				</form>
			</form.AppForm>
		</Page>
	);
}
