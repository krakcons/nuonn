import { ModuleForm } from "@/components/forms/ModuleForm";
import { Page, PageHeader } from "@/components/Page";
import { Button, buttonVariants } from "@/components/ui/button";
import { getApiKeysFn } from "@/lib/handlers/apiKeys";
import { getContextsFn } from "@/lib/handlers/contexts";
import {
	createOrUpdateModuleFn,
	deleteModuleFn,
	getModuleFn,
	getModuleUsageDataFn,
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
import { useLocale, useTranslations } from "@/lib/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useMemo } from "react";
import z from "zod";
import { getBehavioursFn } from "@/lib/handlers/behaviours";

export const Route = createFileRoute("/$locale/admin/modules/$id/")({
	component: RouteComponent,
	validateSearch: z.object({
		tab: z.enum(["info", "usage"]).optional(),
		activeChart: z.enum(["cost", "tokens"]).optional(),
	}),
	loader: async ({ params: { id } }) => {
		const moduleData = await getModuleFn({
			data: { id },
		});
		if (!moduleData) throw notFound();
		return Promise.all([
			moduleData,
			getScenariosFn(),
			getContextsFn(),
			getPersonasFn(),
			getApiKeysFn(),
			getModuleUsageDataFn({ data: { id } }),
			getBehavioursFn(),
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
	const { tab = "info", activeChart = "cost" } = Route.useSearch();
	const router = useRouter();
	const navigate = Route.useNavigate();
	const [
		chatModule,
		scenarios,
		contexts,
		personas,
		apiKeys,
		usageData,
		behaviours,
	] = Route.useLoaderData();
	const { id, data } = chatModule;
	const locale = useLocale();
	const t = useTranslations("Module");
	const tActions = useTranslations("Actions");

	const chartConfig = {
		tokens: {
			label: t.usage.tokens,
			color: "#2563eb",
		},
		cost: {
			label: t.usage.cost,
			color: "#60c589",
		},
	} satisfies ChartConfig;

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

	const total = useMemo(
		() => ({
			tokens: usageData.reduce((acc, curr) => acc + curr.tokens, 0),
			cost: usageData.reduce((acc, curr) => acc + curr.cost, 0),
		}),
		[],
	);

	const getDate = (date: string) => {
		const [year, month, day] = date.split("-");
		return new Date(Number(year), Number(month) - 1, Number(day));
	};

	return (
		<Page className="gap-0">
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
						search={{ preview: true }}
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
			<Tabs
				defaultValue={tab}
				onValueChange={(value: "info" | "usage") =>
					navigate({
						search: (prev) => ({
							...prev,
							tab: value === "info" ? undefined : value,
						}),
					})
				}
			>
				<TabsList>
					<TabsTrigger value="info">{t.tabs.info}</TabsTrigger>
					<TabsTrigger value="usage">{t.tabs.usage}</TabsTrigger>
				</TabsList>
				<TabsContent value="info" className="pt-4">
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
						behaviourOptions={behaviours}
						apiKeyOptions={apiKeys}
					/>
				</TabsContent>
				<TabsContent value="usage">
					<Card className="py-0">
						<CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
							<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
								<CardTitle>{t.usage.title}</CardTitle>
								<CardDescription>
									{t.usage.description}
								</CardDescription>
							</div>
							<div className="flex">
								{["cost", "tokens"].map((key) => {
									const chart =
										key as keyof typeof chartConfig;
									return (
										<button
											key={chart}
											data-active={activeChart === chart}
											className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
											onClick={() =>
												navigate({
													search: (prev) => ({
														...prev,
														activeChart:
															chart === "cost"
																? undefined
																: chart,
													}),
												})
											}
										>
											<span className="text-muted-foreground text-xs">
												{chartConfig[chart].label}
											</span>
											<span className="text-lg leading-none font-bold sm:text-3xl">
												{key === "cost"
													? `$${total["cost"].toFixed(
															2,
														)}`
													: total["tokens"]}
											</span>
										</button>
									);
								})}
							</div>
						</CardHeader>
						<CardContent className="px-2 sm:p-6">
							<ChartContainer
								config={chartConfig}
								className="aspect-auto h-[250px] w-full"
							>
								<BarChart
									accessibilityLayer
									data={usageData}
									margin={{
										left: 12,
										right: 12,
									}}
								>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="date"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										minTickGap={32}
										tickFormatter={(value) => {
											const date = getDate(value);
											return date.toLocaleDateString(
												locale,
												{
													month: "short",
													day: "numeric",
												},
											);
										}}
									/>
									<ChartTooltip
										content={
											<ChartTooltipContent
												className="w-[150px]"
												nameKey="cost"
												labelFormatter={(value) => {
													const date = getDate(value);
													return date.toLocaleDateString(
														locale,
														{
															month: "short",
															day: "numeric",
															year: "numeric",
														},
													);
												}}
											/>
										}
									/>
									<Bar
										dataKey={activeChart}
										fill={`var(--color-${activeChart})`}
									/>
								</BarChart>
							</ChartContainer>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</Page>
	);
}
