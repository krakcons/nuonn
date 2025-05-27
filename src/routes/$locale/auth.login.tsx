import { FloatingPage, PageHeader } from "@/components/Page";
import { useAppForm } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useTranslations } from "@/lib/locale";
import { authClient } from "@/lib/auth.client";

export const LoginFormSchema = z.object({
	email: z.string().email(),
});
export type LoginFormType = z.infer<typeof LoginFormSchema>;

export const Route = createFileRoute("/$locale/auth/login")({
	component: RouteComponent,
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
});

const LoginForm = ({
	onSubmit,
	defaultValues,
}: {
	onSubmit: (data: LoginFormType) => Promise<any>;
	defaultValues?: LoginFormType;
}) => {
	const t = useTranslations("AuthLoginForm");
	const form = useAppForm({
		defaultValues: {
			...defaultValues,
			email: "",
		} as LoginFormType,
		validators: {
			onSubmit: LoginFormSchema,
		},
		onSubmit: ({ value }) => onSubmit(value),
	});

	return (
		<form.AppForm>
			<form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.AppField
					name="email"
					children={(field) => (
						<field.TextField label={t.email.label} />
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};

function RouteComponent() {
	const navigate = Route.useNavigate();
	const requestMutation = useMutation({
		mutationFn: ({ data: { email } }: { data: { email: string } }) =>
			authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" }),
		onSuccess: (_, { data: { email } }) => {
			navigate({
				to: "/$locale/auth/verify-email",
				params: (p) => p,
				search: (s) => ({
					...s,
					email,
				}),
			});
		},
	});
	const t = useTranslations("AuthLogin");

	return (
		<FloatingPage>
			<PageHeader title={t.title} description={t.description} />
			<LoginForm
				onSubmit={(data) => requestMutation.mutateAsync({ data })}
			/>
		</FloatingPage>
	);
}
