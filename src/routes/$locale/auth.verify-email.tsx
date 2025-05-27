import { FloatingPage, PageHeader } from "@/components/Page";
import { useAppForm } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslations } from "@/lib/locale";
import { z } from "zod";
import { authClient } from "@/lib/auth.client";

export const OTPFormSchema = z.object({
	code: z.string().min(6).max(6),
});
export type OTPFormType = z.infer<typeof OTPFormSchema>;

export const Route = createFileRoute("/$locale/auth/verify-email")({
	component: RouteComponent,
	validateSearch: z.object({
		email: z.string().email(),
		redirect: z.string().optional(),
	}),
});

const OTPForm = ({
	onSubmit,
}: {
	onSubmit: (data: OTPFormType) => Promise<any>;
}) => {
	const t = useTranslations("AuthVerifyEmailForm");
	const form = useAppForm({
		defaultValues: {
			code: "",
		} as OTPFormType,
		validators: {
			onSubmit: OTPFormSchema,
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
					name="code"
					children={(field) => (
						<field.TextField
							label={t.code.label}
							autoComplete="off"
						/>
					)}
				/>
				<form.SubmitButton />
			</form>
		</form.AppForm>
	);
};

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const t = useTranslations("AuthVerifyEmail");
	const verifyMutation = useMutation({
		mutationFn: ({ data: { code } }: { data: { code: string } }) =>
			authClient.signIn.emailOtp({
				otp: code,
				email: search.email,
			}),
		onSuccess: () => {
			navigate({
				to: search.redirect ?? "/$locale/admin",
				search: (s) => ({
					...s,
					redirect: undefined,
					email: undefined as any,
				}),
			});
		},
	});

	return (
		<FloatingPage>
			<PageHeader title={t.title} description={t.description} />
			<OTPForm
				onSubmit={(data) => verifyMutation.mutateAsync({ data })}
			/>
		</FloatingPage>
	);
}
