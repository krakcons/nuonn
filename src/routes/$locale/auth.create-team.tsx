import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useAppForm } from "@/components/ui/form";
import { useLocale, useTranslations } from "@/lib/locale";
import type { Organization } from "better-auth/plugins";
import { FloatingPage, PageHeader } from "@/components/Page";
import { authClient } from "@/lib/auth.client";

const CollapsibleWrapper = ({ children }: { children: React.ReactNode }) => {
	const t = useTranslations("Form");
	const [open, setOpen] = useState(false);
	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className="group/collapsible -mt-4 mb-0"
		>
			<CollapsibleTrigger asChild>
				<Button variant="link" className="self-start -ml-3 mb-4">
					{t.otherSettings} ({t.optional})
					<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="space-y-8 mb-8">
				{children}
			</CollapsibleContent>
		</Collapsible>
	);
};

const BlankWrapper = ({ children }: { children: React.ReactNode }) => (
	<>{children}</>
);

export const TeamForm = ({
	defaultValues,
	collapsible,
	onSubmit,
}: {
	defaultValues?: Organization;
	collapsible?: boolean;
	onSubmit: (value: Organization) => Promise<any>;
}) => {
	const t = useTranslations("TeamForm");
	const form = useAppForm({
		defaultValues: {
			name: "",
			favicon: "",
			logo: "",
			...defaultValues,
		} as Organization,
		onSubmit: ({ value }) => onSubmit(value),
	});

	const Wrapper = collapsible ? CollapsibleWrapper : BlankWrapper;

	return (
		<form.AppForm>
			<form
				onSubmit={(e) => e.preventDefault()}
				className="flex flex-col gap-8 items-start"
			>
				{!collapsible && <form.BlockNavigation />}
				<form.AppField name="name">
					{(field) => <field.TextField label={t.name} />}
				</form.AppField>
				<Wrapper>
					<div className="flex flex-col gap-2">
						<form.AppField name="logo">
							{(field) => (
								<field.ImageField
									label={t.logo}
									size={{
										width: 350,
										height: 100,
										suggestedWidth: 350,
										suggestedHeight: 100,
									}}
								/>
							)}
						</form.AppField>
					</div>
				</Wrapper>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};

export const Route = createFileRoute("/$locale/auth/create-team")({
	component: RouteComponent,
});

function RouteComponent() {
	const locale = useLocale();
	const t = useTranslations("TeamForm");
	const navigate = Route.useNavigate();

	return (
		<FloatingPage>
			<PageHeader
				title={t.create.title}
				description={t.create.description}
			/>
			<TeamForm
				collapsible
				onSubmit={async (values) => {
					await authClient.organization
						.create({
							name: values.name,
							slug: values.name.toLowerCase(),
						})
						.then(() => {
							navigate({
								to: "/$locale/admin",
								params: {
									locale,
								},
								search: (s) => s,
								reloadDocument: true,
							});
						});
				}}
			/>
		</FloatingPage>
	);
}
