import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onError: (err) => {
				console.error(err);
				toast.error(err.message, {
					duration: 8000,
				});
			},
		},
	},
});

export function getContext() {
	return {
		queryClient,
	};
}

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
