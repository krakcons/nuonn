import { PageSubHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";
import { PersonaDataSchema, type PersonaDataType } from "@/lib/types/personas";
import { Plus, Trash } from "lucide-react";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { useTranslations } from "@/lib/locale";

export const PersonaForm = ({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: PersonaDataType;
	onSubmit: ({ value }: { value: PersonaDataType }) => Promise<any>;
}) => {
	const tActions = useTranslations("Actions");
	const t = useTranslations("PersonaForm");
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
			...defaultValues,
		} as PersonaDataType,
		validators: {
			onSubmit: PersonaDataSchema,
		},
		onSubmit,
	});

	const statOptions = [
		{
			label: t.statOptions.low,
			value: "low",
		},
		{
			label: t.statOptions.medium,
			value: "medium",
		},
		{
			label: t.statOptions.high,
			value: "high",
		},
	];

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
					name="age"
					children={(field) => (
						<field.TextField type="number" label={t.age} optional />
					)}
				/>
				<form.AppField
					name="gender"
					children={(field) => (
						<field.TextField label={t.gender} optional />
					)}
				/>
				<form.AppField
					name="sexuality"
					children={(field) => (
						<field.TextField label={t.sexuality} optional />
					)}
				/>
				<form.AppField
					name="pronouns"
					children={(field) => (
						<field.TextField label={t.pronouns} optional />
					)}
				/>
				<form.AppField
					name="ethnicity"
					children={(field) => (
						<field.TextField label={t.ethnicity} optional />
					)}
				/>
				<form.AppField
					name="country"
					children={(field) => (
						<field.TextField label={t.country} optional />
					)}
				/>
				<form.AppField
					name="education"
					children={(field) => (
						<field.TextField label={t.education} optional />
					)}
				/>
				<form.AppField
					name="location"
					children={(field) => (
						<field.TextField label={t.location} optional />
					)}
				/>
				<form.AppField
					name="height"
					children={(field) => (
						<field.TextField label={t.height} optional />
					)}
				/>
				<form.AppField
					name="build"
					children={(field) => (
						<field.TextField label={t.build} optional />
					)}
				/>
				<form.AppField
					name="transportation"
					children={(field) => (
						<field.TextField label={t.transportation} optional />
					)}
				/>
				<form.AppField
					name="disibility"
					children={(field) => (
						<field.TextField label={t.disibility} optional />
					)}
				/>
				<form.AppField
					name="occupation"
					children={(field) => (
						<field.TextField label={t.occupation} optional />
					)}
				/>
				<form.AppField
					name="relationships"
					children={(field) => (
						<field.TextField label={t.relationships} optional />
					)}
				/>
				<form.AppField
					name="appearance"
					children={(field) => (
						<field.TextField label={t.appearance} optional />
					)}
				/>
				<form.AppField
					name="religion"
					children={(field) => (
						<field.TextField label={t.religion} optional />
					)}
				/>
				<form.AppField
					name="politics"
					children={(field) => (
						<field.TextField label={t.politics} optional />
					)}
				/>
				<PageSubHeader title="Stats" />
				<div className="flex gap-2">
					<form.AppField
						name="intelligence"
						children={(field) => (
							<field.SelectField
								label={t.intelligence}
								options={statOptions}
							/>
						)}
					/>
					<form.AppField
						name="memory"
						children={(field) => (
							<field.SelectField
								label={t.memory}
								options={statOptions}
							/>
						)}
					/>
					<form.AppField
						name="wealth"
						children={(field) => (
							<field.SelectField
								label={t.wealth}
								options={statOptions}
							/>
						)}
					/>
					<form.AppField
						name="health"
						children={(field) => (
							<field.SelectField
								label={t.health}
								options={statOptions}
							/>
						)}
					/>
					<form.AppField
						name="mentalHealth"
						children={(field) => (
							<field.SelectField
								label={t.mentalHealth}
								options={statOptions}
							/>
						)}
					/>
				</div>
				<PageSubHeader title={t.personality} />
				<form.AppField
					name="traits"
					children={(field) => (
						<field.TextAreaField label={t.traits} optional />
					)}
				/>
				<form.AppField
					name="hobbies"
					children={(field) => (
						<field.TextAreaField label={t.hobbies} optional />
					)}
				/>
				<form.AppField
					name="likes"
					children={(field) => (
						<field.TextAreaField label={t.likes} optional />
					)}
				/>
				<form.AppField
					name="dislikes"
					children={(field) => (
						<field.TextAreaField label={t.dislikes} optional />
					)}
				/>
				<form.AppField
					name="backstory"
					children={(field) => (
						<field.TextAreaField label={t.backstory} optional />
					)}
				/>
				<form.AppField
					name="languages"
					mode="array"
					children={(field) => (
						<div className="flex flex-col gap-4">
							<PageSubHeader
								title={t.languages.title}
								description={t.languages.description}
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
									<Plus />
									{tActions.create}
								</Button>
							</PageSubHeader>
							{field.state?.value?.map((_, i) => (
								<Card key={i}>
									<CardHeader>
										<CardTitle>
											{t.languages.name} {i + 1}
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
									<CardContent className="flex gap-4">
										<form.AppField
											name={`languages[${i}].name`}
											children={(subField) => (
												<div className="flex-1">
													<subField.TextField
														label={t.languages.name}
													/>
												</div>
											)}
										/>
										<form.AppField
											name={`languages[${i}].spoken`}
											children={(subField) => (
												<subField.SelectField
													label={t.languages.spoken}
													options={statOptions}
												/>
											)}
										/>
										<form.AppField
											name={`languages[${i}].written`}
											children={(subField) => (
												<subField.SelectField
													label={t.languages.written}
													options={statOptions}
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
