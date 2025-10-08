import { useParams, useSearchParams } from "react-router-dom";

export const useLocationData = (): {
	params: Record<string, string | undefined>;
	queryParams: URLSearchParams;
} => {
	const params = useParams();
	const [queryParams] = useSearchParams();

	return { params, queryParams };
};
