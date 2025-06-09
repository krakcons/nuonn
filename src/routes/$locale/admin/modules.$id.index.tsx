import { ModuleForm } from "@/components/forms/ModuleForm";
import { Page, PageHeader } from "@/components/Page";
import { Button, buttonVariants } from "@/components/ui/button";
import { getApiKeysFn } from "@/lib/handlers/apiKeys";
import { getContextsFn } from "@/lib/handlers/contexts";
import {
	createOrUpdateModuleFn,
	deleteModuleFn,
	getModuleFn,
} from "@/lib/handlers/modules";
import { getPersonasFn } from "@/lib/handlers/personas";
import { getScenariosFn } from "@/lib/handlers/scenarios";
import type { ModuleType } from "@/lib/types/modules";
import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	notFound,
	useRouter,
} from "@tanstack/react-router";
import { Download, Play, Trash } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { useTranslations } from "@/lib/locale";

export const Route = createFileRoute("/$locale/admin/modules/$id/")({
	component: RouteComponent,
	loader: async ({ params: { id } }) => {
		const module = await getModuleFn({
			data: { id },
		});
		if (!module) throw notFound();
		return Promise.all([
			module,
			getScenariosFn(),
			getContextsFn(),
			getPersonasFn(),
			getApiKeysFn(),
		]);
	},
});

const imsManifest = ({ id, data }: ModuleType) => `
<?xml version="1.0" standalone="no" ?>
<manifest identifier="com.scorm.${id}.runtime.basicruntime.12" version="1"
         xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
         xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                             http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                             http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
	<organizations default="default_org">
		<organization identifier="default_org">
			<title>${data.name}</title>
			<item identifier="item_1" identifierref="resource_1">
				<title>{data.name}</title>
			</item>
		</organization>
	</organizations>
	<resources>
		<resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
		<file href="logo.svg"/>
		</resource>
	</resources>
</manifest>
`;

function RouteComponent() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const [chatModule, scenarios, contexts, personas, apiKeys] =
		Route.useLoaderData();
	const { id, data } = chatModule;
	const t = useTranslations("Module");
	const tActions = useTranslations("Actions");

	const updateModule = useMutation({
		mutationFn: createOrUpdateModuleFn,
		onSuccess: () => {
			toast.success(t.toast);
			router.invalidate();
		},
	});

	const deleteModule = useMutation({
		mutationFn: deleteModuleFn,
		onSuccess: () => {
			toast.success(t.deleteToast);
			navigate({
				to: "/$locale/admin",
			});
		},
	});

	const download = async () => {
		const zip = new JSZip();
		zip.file("imsmanifest.xml", imsManifest(chatModule));
		zip.file(
			"index.html",
			`<script src="${window.location.origin}/scorm.js"></script><iframe src="${window.location.origin}/modules/${id}/chat" style="width: 100%; height: 100%;"></iframe>`,
		);
		const response = await fetch("logo.svg");
		const blob = await response.blob();
		zip.file("logo.svg", blob);

		const zipBlob = await zip.generateAsync({ type: "blob" });

		const link = document.createElement("a");
		link.href = URL.createObjectURL(zipBlob);
		link.download = `${data.name.replaceAll(" ", "_")}.zip`;
		link.click();
	};

	return (
		<Page>
			<PageHeader title={data.name} description={t.edit}>
				<div className="flex gap-2">
					<Button variant="outline" onClick={download}>
						<Download />
						{t.export}
					</Button>
					<Link
						to="/$locale/modules/$id/chat"
						params={{ id }}
						from={Route.fullPath}
						className={buttonVariants()}
						target="_blank"
					>
						<Play />
						{t.preview}
					</Link>
					<Button
						variant="secondary"
						onClick={() => {
							deleteModule.mutate({
								data: {
									id,
								},
							});
						}}
					>
						<Trash />
						{tActions.delete}
					</Button>
				</div>
			</PageHeader>
			<ModuleForm
				key={id}
				defaultValues={{
					...data,
					apiKeyId: chatModule.apiKeyId,
				}}
				onSubmit={({ value }) =>
					updateModule.mutateAsync({
						data: {
							...value,
							id,
						},
					})
				}
				scenarioOptions={scenarios}
				personaOptions={personas}
				contextOptions={contexts}
				apiKeyOptions={apiKeys}
			/>
		</Page>
	);
}
