interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

export type ApiDoc = {
  id: string;
  name: string;
  description: string;
  baseURL: string;
};

export type Server = {
  id: string;
  apiId: string;
  url: string;
  description: string | null;
};

export type Endpoint = {
  id: string;
  apiId: string;
  method: string;
  path: string;
  summary: string | null;
  security: string | null;
  headers: Record<string, unknown> | null;
  description: string | null;
  tags: string[] | null;
  createdAt: Date | null;
};

export type QueryParam = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  endpointId: string | null;
};

export type PathParam = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  endpointId: string | null;
};

export type Request = {
  id: string;
  example: Record<string, unknown>;
  description: string;
  endpointId: string | null;
};

type Response = {
  id: string;
  example: Record<string, unknown>;
  description: string;
  status: number;
  endpointId: string | null;
};

type SdkWrapper = {
  id: string;
  apiId: string;
  language: string;
  code: string[];
};

type FAQs = {
  id: string;
  apiId: string;
  question: string;
  answer: string;
};

// RELATIONSHIP TYPES

type EndpointWithRelations = Endpoint & {
  queryParams?: QueryParam[];
  pathParams?: PathParam[];
  request?: Request[];
  responses?: Response[];
};

type ApiDocWithRelations = ApiDoc & {
  servers: Server[];
  endpoints: EndpointWithRelations[];
  sdkWrappers: SdkWrapper[];
  faqs: FAQs[];
};

type ServerWithRelations = Server & {
  api: ApiDoc;
};

type SdkWrapperWithRelations = SdkWrapper & {
  api: ApiDoc;
};

type FAQRelations = FAQs & {
  api: ApiDoc;
};

type QueryParamWithRelations = QueryParam & {
  endpoint: Endpoint;
};

type PathParamWithRelations = PathParam & {
  endpoint: Endpoint;
};

type RequestWithRelations = Request & {
  endpoint: Endpoint;
};

type ResponseWithRelations = Response & {
  endpoint: Endpoint;
};
