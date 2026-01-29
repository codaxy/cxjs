export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  srcFolder: string;
}

export interface TemplatesManifest {
  templates: TemplateConfig[];
  defaultTemplate: string;
}
