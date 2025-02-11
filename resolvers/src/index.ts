export class HandleResolver {
	private resolverUrl: string;
	private fetch: typeof globalThis.fetch;
	/**@param resolverUrl example: "https://public.api.bsky.app" */
	constructor(resolverUrl: string, fetch?: typeof globalThis.fetch) {
		this.resolverUrl = resolverUrl;
		this.fetch = fetch ?? ((...p) => globalThis.fetch(...p));
	}
	async resolve(handle: string) {
		try {
			const data: { did: string } = await this.fetch(
				`${this.resolverUrl}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
			).then((res) => res.json());
			return data.did;
		} catch {
			return null;
		}
	}
}
const DIDPLC_PREFIX = "did:plc:" as const;
const DIDWEB_PREFIX = "did:web:" as const;
export class DidResolver {
	private plcUrl: string;
	/**@param plcUrl example: "https://plc.directory" */
	constructor(plcUrl?: string) {
		this.plcUrl = plcUrl ?? "https://plc.directory";
	}
	async resolve(did: string): Promise<DIDDoc | null> {
		if (did.startsWith(DIDPLC_PREFIX)) {
			return await fetch(`${this.plcUrl}/${did}`).then((res) => (res.ok ? res.json() : null));
		} else if (did.startsWith(DIDWEB_PREFIX)) {
			return await fetch(`https://${did.slice(DIDWEB_PREFIX.length)}/.well-known/did.json`).then((res) =>
				res.ok ? res.json() : null,
			);
		} else {
			throw new Error("Unsupported DID method");
		}
	}
}

export type DIDDoc = {
	id: string;
	alsoKnownAs?: string[];
	verificationMethod?: {
		id: string;
		type: string;
		controller: string;
		publicKeyMultibase?: string;
	}[];
	service?: {
		id: string;
		type: string;
		serviceEndpoint: string | Record<string, unknown>;
	}[];
};
