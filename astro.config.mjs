import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  site: process.env.SITE_URL ?? 'https://docs.adagiodata.com',
  integrations: [
    starlight({
      title: 'Adagio',
      description: 'QIIME2 pipeline orchestration platform',
      disable404Route: true,
      social: {
        github: 'https://github.com/cymis',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
          ],
        },
        {
          label: 'Building Pipelines',
          items: [
            { label: 'The Pipeline Canvas', slug: 'building/canvas' },
            { label: 'Working with Nodes', slug: 'building/nodes' },
            { label: 'Connections and Semantic Types', slug: 'building/connections-and-types' },
            { label: 'Inputs, Parameters, and Defaults', slug: 'building/inputs-parameters-and-defaults' },
            { label: 'Managing Pipelines', slug: 'building/managing' },
          ],
        },
        {
          label: 'Running Pipelines',
          items: [
            { label: 'From the UI', slug: 'running/from-ui' },
            { label: 'With the CLI', slug: 'running/cli' },
            { label: 'Pipeline Channels', slug: 'running/pipeline-channels' },
            { label: 'Runtime Configuration', slug: 'running/cli-config' },
            { label: 'Cache Behavior', slug: 'running/cache' },
          ],
        },
        {
          label: 'Contributing',
          items: [
            { label: 'Plugin Development Resources', slug: 'contributing/building-a-plugin' },
            { label: 'Registering and Submitting a Plugin', slug: 'contributing/submitting-a-plugin' },
            { label: 'Submitting a Pipeline', slug: 'contributing/submitting-a-pipeline' },
            { label: 'Developer Workflow', slug: 'contributing/developer-workflow' },
          ],
        },
      ],
    }),
  ],
});
