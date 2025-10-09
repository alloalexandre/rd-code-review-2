import { Invoices } from "../..";
import { validatedQuery } from "/imports/utils/validatedQuery";

Invoices.novaQueries.getInvoicesByCustomer = validatedQuery(
	Invoices,
	null,
	(params) => ({
		$: { filters: { customerId: params.customerId } },
	}),
);
