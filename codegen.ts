import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: './schema.graphql',
	documents: ['src/**/*.svelte', 'src/**/*.ts'],
	generates: {
		'src/lib/gql/': {
			preset: 'client',
			presetConfig: {
				gqlTagName: 'gql'
			}
		}
	}
};

export default config;
