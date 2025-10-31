declare module "swagger-ui-react" {
  import { ComponentType } from "react";

  interface SwaggerUIProps {
    url?: string;
    spec?: Record<string, any>;
    docExpansion?: "list" | "full" | "none";
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    defaultModelRendering?: "example" | "model";
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}
